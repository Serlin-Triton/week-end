using System;

namespace ZoomTrip.API.Models
{
    public class ServiceRecord
    {
        public int Id { get; set; }
        public int CarId { get; set; }
        public Car? Car { get; set; }

        public int WorkshopId { get; set; }
        public Workshop? Workshop { get; set; }

        public DateTime ServiceDate { get; set; }
        public decimal CostAmount { get; set; }
    }
}
