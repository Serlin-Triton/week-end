namespace ZoomTrip.API.Models
{
    public class Owner
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public ICollection<Car> CarsOwned { get; set; } = new List<Car>();
    }
}
