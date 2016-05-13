Template.SchoolUserListPage.helpers({
  "class": function() {
    return this.table["class"] || "";
  },
  fields: function() {
    return _.map(this.table.fields, function(v) {
      return {
        value: v
      };
    });
  },
  header: function() {
    return _.map(this.table.header || this.table.fields, function(v) {
      return {
        value: v
      };
    });
  }
});