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
    public class OwnersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OwnersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Owner>>> GetOwners()
        {
            // Excluding CarsOwned to prevent circular reference JSON issues if not using DTOs, 
            // but we can include it safely if the Car model doesn't strictly serialize Owner back.
            // Using AsNoTracking for performance.
            return await _context.Owners.AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Owner>> GetOwner(int id)
        {
            var owner = await _context.Owners.Include(o => o.CarsOwned).FirstOrDefaultAsync(o => o.Id == id);
            if (owner == null) return NotFound();
            return owner;
        }

        [HttpPost]
        public async Task<ActionResult<Owner>> CreateOwner(Owner owner)
        {
            _context.Owners.Add(owner);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetOwner", new { id = owner.Id }, owner);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOwner(int id, Owner owner)
        {
            if (id != owner.Id) return BadRequest();
            _context.Entry(owner).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException) { if (!OwnerExists(id)) return NotFound(); else throw; }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOwner(int id)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return NotFound();
            _context.Owners.Remove(owner);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool OwnerExists(int id) => _context.Owners.Any(e => e.Id == id);
    }
}
