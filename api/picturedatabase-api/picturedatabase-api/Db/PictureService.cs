using Microsoft.Extensions.Options;
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
            var mongoClient = new MongoClient(
                pictureDatabaseSettings.Value.ConnectionString);

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
    }
}
