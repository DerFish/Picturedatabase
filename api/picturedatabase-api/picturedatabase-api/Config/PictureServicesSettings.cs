namespace picturedatabase_api.Config
{
    public class PictureServicesSettings
    {
        public string GreyscaleServiceAddress { get; set; } = null!;
        public string ThumbnailServiceAddress { get; set; } = null!;
        public int? ThumbnailWidth { get; set; } = null!;
    }
}
