using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZoomTrip.API.Data;
using ZoomTrip.API.Models;

namespace ZoomTrip.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(AppDbContext context, ILogger<BookingsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings
                .Include(b => b.StartPoint)
                .Include(b => b.DropPoint)
                .Include(b => b.AssignedDriver)
                .Include(b => b.AssignedCar)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.StartPoint)
                .Include(b => b.DropPoint)
                .Include(b => b.AssignedDriver)
                .Include(b => b.AssignedCar)
                .FirstOrDefaultAsync(b => b.Id == id);
            
            if (booking == null) return NotFound();
            return booking;
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
        {
            booking.BookingDate = DateTime.UtcNow;
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetBooking", new { id = booking.Id }, booking);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, Booking booking)
        {
            if (id != booking.Id) return BadRequest();
            _context.Entry(booking).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException) { if (!BookingExists(id)) return NotFound(); else throw; }
            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] StatusUpdateRequest request)
        {
            var status = request.Status;
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.Status = status;

            if (status == "Accepted") 
            {
                _logger.LogInformation($"[Mock Email] Booking {id} accepted. Notification sent to customer.");
            }

            if (booking.CarId.HasValue && status == "Accepted")
            {
                var car = await _context.Cars.FindAsync(booking.CarId.Value);
                if (car != null) car.AvailabilityStatus = "Cars Outside";
            }
            if (booking.CarId.HasValue && status == "Completed")
            {
                var car = await _context.Cars.FindAsync(booking.CarId.Value);
                if (car != null) car.AvailabilityStatus = "Available";
            }

            await _context.SaveChangesAsync();
            return Ok(booking);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool BookingExists(int id) => _context.Bookings.Any(e => e.Id == id);
    }

    public class StatusUpdateRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
