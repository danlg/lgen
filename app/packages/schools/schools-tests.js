// Write your tests here!
// Here is an example.
Tinytest.add('example', function (test) {
  test.equal(true, true);
});


//Create School

//call below as system admin
//Meteor.call('smartix:schools/createSchool',{name:'Shau Kei Wan - Elsa High',username:'elsahigh',logo:'1234567',tel:'36655388',web:'http://www.carmel.edu.hk/',email:'elsahighschool@carmel.edu.hk.fake',active:true,preferences:{}},function(err,result){if(err){console.log(err)} console.log(result)});

//expect return
// Object
// {school: schoolId , initialAdmin:{initalPassword, username}}

//Then try use accounts-schools to assign existing user or create new user to school


