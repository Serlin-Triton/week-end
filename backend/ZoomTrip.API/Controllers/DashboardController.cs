using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZoomTrip.API.Data;

namespace ZoomTrip.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalCars = await _context.Cars.CountAsync();
            var availableCars = await _context.Cars.CountAsync(c => c.AvailabilityStatus == "Available");
            var carsOutside = await _context.Cars.CountAsync(c => c.AvailabilityStatus == "Cars Outside" || c.AvailabilityStatus == "Booked");

            var now = DateTime.UtcNow;

            var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var startOfWeek = now.Date.AddDays(now.DayOfWeek == DayOfWeek.Sunday ? -6 : -(int)now.DayOfWeek + 1);
            startOfWeek = DateTime.SpecifyKind(startOfWeek, DateTimeKind.Utc);

            var monthlyBookingCount = await _context.Bookings
                .CountAsync(b => b.BookingDate >= startOfMonth);

            var weeklyBookingCount = await _context.Bookings
                .CountAsync(b => b.BookingDate >= startOfWeek);

            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == "Completed" || b.Status == "Payment Waiting")
                .SumAsync(b => b.BookingAmount);

            var counts = new
            {
                totalCars,
                availableCars,
                carsOutside,
                monthlyBookingCount,
                weeklyBookingCount,
                totalRevenue
            };

            return Ok(counts);
        }
    }
}
