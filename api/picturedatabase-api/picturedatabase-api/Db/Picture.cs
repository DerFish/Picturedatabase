using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using ThirdParty.Json.LitJson;

namespace picturedatabase_api.Db
{
    public class Picture
    {
        public Picture(string? id, string fileName, string fileType, string fileSize)
        {
            ExifProperties = new List<ExifProperty>();
            Tags = new List<Tag>();
            FileName = fileName;
            Id = id;
            FileSize = fileSize;
            FileType = fileType;
        }

        public string CreateDate { get; set; }

        public List<ExifProperty> ExifProperties { get; set; }
        public string FileName { get; set; } = null!;
        public string FileSize { get; set; }
        public string FileType { get; set; }

        [BsonId]
        public string? Id { get; set; }

        public List<Tag> Tags { get; set; }
    }
}
