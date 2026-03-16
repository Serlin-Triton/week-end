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
    public class WorkshopsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkshopsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Workshop>>> GetWorkshops()
        {
            return await _context.Workshops.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Workshop>> GetWorkshop(int id)
        {
            var workshop = await _context.Workshops.FindAsync(id);
            if (workshop == null) return NotFound();
            return workshop;
        }

        [HttpPost]
        public async Task<ActionResult<Workshop>> CreateWorkshop(Workshop workshop)
        {
            _context.Workshops.Add(workshop);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetWorkshop", new { id = workshop.Id }, workshop);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkshop(int id, Workshop workshop)
        {
            if (id != workshop.Id) return BadRequest();
            _context.Entry(workshop).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException) { if (!WorkshopExists(id)) return NotFound(); else throw; }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkshop(int id)
        {
            var workshop = await _context.Workshops.FindAsync(id);
            if (workshop == null) return NotFound();
            _context.Workshops.Remove(workshop);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool WorkshopExists(int id) => _context.Workshops.Any(e => e.Id == id);
    }
}
