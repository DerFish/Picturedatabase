namespace picturedatabase_api.Db
{
    public class ExifProperty
    {
        public ExifProperty(string name, string value)
        {
            Name = name;
            Value = value;
        }

        public string Name { get; set; }
        public string Value { get; set; }
    }
}
