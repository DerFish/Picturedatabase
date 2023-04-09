using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using picturedatabase_api.Config;

namespace picturedatabase_api.Db
{
    public class PictureService
    {
        private readonly IMongoCollection<Picture> _picturesCollection;

        public PictureService(
            IOptions<PictureDatabaseSettings> pictureDatabaseSettings)
        {
            var con = "";
#if DEBUG
            con = "mongodb://localhost:27018";
#else
con=pictureDatabaseSettings.Value.ConnectionString;
#endif
            var mongoClient = new MongoClient(con
                );

            var mongoDatabase = mongoClient.GetDatabase(
                pictureDatabaseSettings.Value.DatabaseName);

            _picturesCollection = mongoDatabase.GetCollection<Picture>(
                pictureDatabaseSettings.Value.PictureCollectionName);
        }

        public async Task CreateAsync(Picture newBook) =>
            await _picturesCollection.InsertOneAsync(newBook);

        public async Task<List<Picture>> GetAsync() =>
                    await _picturesCollection.Find(_ => true).ToListAsync();

        public async Task<Picture?> GetAsync(string id) =>
            await _picturesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task RemoveAsync(string id) =>
            await _picturesCollection.DeleteOneAsync(x => x.Id == id);

        public async Task UpdateAsync(string id, Picture updatedBook) =>
                    await _picturesCollection.ReplaceOneAsync(x => x.Id == id, updatedBook);

        public List<Tag> GetTags()
        {
            return _picturesCollection.AsQueryable<Picture>().SelectMany(s => s.Tags).Distinct().ToList();
        }

        internal List<Picture> GetByTagsAsync(List<string> tags)
        {
            return _picturesCollection.AsQueryable<Picture>().Where(w => w.Tags.Any(a => tags.Any(b => a.Text == b))).ToList();
        }
    }
}
