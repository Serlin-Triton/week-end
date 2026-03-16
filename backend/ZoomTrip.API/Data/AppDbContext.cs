using Microsoft.EntityFrameworkCore;

namespace ZoomTrip.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Models.User> Users { get; set; }
        public DbSet<Models.Owner> Owners { get; set; }
        public DbSet<Models.Car> Cars { get; set; }
        public DbSet<Models.Driver> Drivers { get; set; }
        public DbSet<Models.Location> Locations { get; set; }
        public DbSet<Models.Workshop> Workshops { get; set; }
        public DbSet<Models.ServiceRecord> ServiceRecords { get; set; }
        public DbSet<Models.Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Models.Booking>()
                .HasOne(b => b.StartPoint)
                .WithMany()
                .HasForeignKey(b => b.StartPointId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Models.Booking>()
                .HasOne(b => b.DropPoint)
                .WithMany()
                .HasForeignKey(b => b.DropPointId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
