namespace picturedatabase_api.Config
{
    public class PictureDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string PictureCollectionName { get; set; } = null!;
    }
}
