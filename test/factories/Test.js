module.exports = (factory) => {

  factory.define('active', Restaurant)
    .attr("name", "Mini")
    .attr("active", true);

  factory.define('inactive').parent('active')
    .attr("active", false);

  factory.define('mini', TableType)
    .attr("name", "Mini");
}
