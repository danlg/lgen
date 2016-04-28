Tinytest.add('Absence - Exported Absence Object correctly', function (test) {
  test.equal(typeof Absence, "object");
});

Tinytest.add('Absence - Absence Collections exported correctly', function (test) {
  test.equal(!!Absence.Collections, true);
});