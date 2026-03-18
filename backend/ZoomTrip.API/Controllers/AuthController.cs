using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ZoomTrip.API.Data;
using BCrypt.Net;

namespace ZoomTrip.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Name) || 
                    string.IsNullOrWhiteSpace(request.MobileNumber) || 
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "Name, Mobile Number, and Password are required." });
                }

                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.MobileNumber == request.MobileNumber);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "User with this mobile number already exists." });
                }

                var newUser = new Models.User
                {
                    Name = request.Name,
                    MobileNumber = request.MobileNumber,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Role = "Staff" // Default role
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(newUser);

                return Ok(new AuthResponse
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = newUser.Id,
                        Name = newUser.Name,
                        MobileNumber = newUser.MobileNumber,
                        Role = newUser.Role,
                        PhotoUrl = newUser.PhotoUrl
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error during registration", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.MobileNumber == request.MobileNumber);
                
                bool isPasswordValid = false;
                if (user != null && !string.IsNullOrEmpty(user.PasswordHash))
                {
                    try
                    {
                        isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password ?? "", user.PasswordHash);
                    }
                    catch (Exception)
                    {
                        // In case the hash in DB is invalid (e.g. plain text or corrupted), consider it invalid
                        isPasswordValid = false;
                    }
                }

                if (user == null || !isPasswordValid)
                {
                    return Unauthorized(new { message = "Invalid mobile number or password" });
                }

                var token = GenerateJwtToken(user);

                return Ok(new AuthResponse
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Name = user.Name,
                        MobileNumber = user.MobileNumber,
                        Role = user.Role,
                        PhotoUrl = user.PhotoUrl
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error during login", error = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.MobileNumber))
                {
                    return BadRequest(new { message = "Mobile number is required" });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.MobileNumber == request.MobileNumber);
                if (user == null)
                {
                    // To prevent enumeration attacks, we'll return ok even if user doesn't exist
                    return Ok(new { message = "If the mobile number exists, you can proceed to reset.", success = true });
                }

                return Ok(new { message = "Mobile number verified.", success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error during forgot password", error = ex.Message });
            }
        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.MobileNumber) || string.IsNullOrEmpty(request.NewPassword))
                {
                    return BadRequest(new { message = "Mobile number and New password are required" });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.MobileNumber == request.MobileNumber);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found." });
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Password has been reset successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error during password reset", error = ex.Message });
            }
        }

        private string GenerateJwtToken(Models.User user)
        {
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? _configuration["Jwt:Key"];
            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? _configuration["Jwt:Issuer"];
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new Exception("JWT Secret Key is missing.");
            }

            var key = Encoding.UTF8.GetBytes(jwtKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.MobilePhone, user.MobileNumber),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer ?? "ZoomTripAPI",
                audience: jwtAudience ?? "ZoomTripApp",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(120),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string MobileNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordRequest
    {
        public string MobileNumber { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string MobileNumber { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserDto? User { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? PhotoUrl { get; set; }
    }
}
