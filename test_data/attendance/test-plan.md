### Set-Up

* Create 21 users account
* Create parents relationships
    1. 7 students would have no parent records (1-7)
    1. 7 students would have one parent record (8-14)
    1. 7 students would have two parent records (15-21)

### Expected Absence (Daniel)

* Using the admin console, create expected absences record for one student which spans yesterday (e.g. 0800 - 1200 today)
    1. Checks that a record is created on the database with the correct information
    1. Checks that the reporterId is set to the admin's `_id`
    1. Checks that the `status` is set to `true`
* Using the app, create expected absences record for one student which spans yesterday (e.g. 0800 - 1200 today)
    1. Checks that a record is created on the database with the correct information
    1. Checks that the reporterId is set to the parent's `_id`
    1. Checks that the `status` is set to `false`
* Using the admin console, create expected absences record for one student which spans today (e.g. 0800 - 1200 today)
* Using the app, create expected absences record for one student which spans today (e.g. 0800 - 1200 today)
* Using the admin console, create expected absences record for one student which spans tomorrow (e.g. 0800 - 1200 today)
* Using the app, create expected absences record for one student which spans tomorrow (e.g. 0800 - 1200 today)

* Checks that the dates displayed on the `/<schoolName>/admin/absence/expected` page are correct

* Use the `/<schoolName>/admin/absence/expected` page to approve / unapprove the expected absences
    * Checks that the `status` property of the document is updated on the database
    * Checks that the parents are notified whenever an expected absence is approved

### Upload Attendance (Daniel)

* Create sample attendance records, dated to today, with the following variations (the number coincides with the student ID):

    1. Non-existent student 1
    1. Non-existent student 2
    1. Student with no parent records who has an expected absence record who is on-time
    1. Student with no parent records who has an expected absence record who is 'late' but arrived before the expected time of arrival (ETA)
    1. Student with no parent records who has an expected absence record who is 'late' and arrived after the ETA
    1. Student with no parent records who has an expected absence record who is absent
    1. Student with no parent records who does not have an expected absence record and is on-time
    1. Student with no parent records who does not have an expected absence record and is late
    1. Student with no parent records who does not have an expected absence record and is absent 
    1. Student with one parent record who has an expected absence record who is on-time
    1. Student with one parent record who has an expected absence record who is 'late' but arrived before the expected time of arrival (ETA)
    1. Student with one parent record who has an expected absence record who is 'late' and arrived after the ETA
    1. Student with one parent record who has an expected absence record who is absent
    1. Student with one parent record who does not have an expected absence record and is on-time
    1. Student with one parent record who does not have an expected absence record and is late
    1. Student with one parent record who does not have an expected absence record and is absent 
    1. Student with two parent records who has an expected absence record who is on-time
    1. Student with two parent records who has an expected absence record who is 'late' but arrived before the expected time of arrival (ETA)
    1. Student with two parent records who has an expected absence record who is 'late' and arrived after the ETA
    1. Student with two parent records who has an expected absence record who is absent
    1. Student with two parent records who does not have an expected absence record and is on-time
    1. Student with two parent records who does not have an expected absence record and is late
    1. Student with two parent records who does not have an expected absence record and is absent
    
* Upload the school attendance records using CSV
* Upload the school attendance records using XSLX (to be reintroduced/uncommented out)

* Checks that the non-existent users are listed out on the upload csv/xslx page
* Checks that the number of successful records inserted is listed out on the upload csv/xslx page

* Go to `/<schoolName>/admin/absence/absentees` and checks that the records are as expected
* Sign in as one of the parents of students who are late or missing and checks that they received the notification

### Reply from App (Terence)

> Ask Terence for more test cases

* Pick one of the students with one parent record and use the app to reply to the notification, citing the reason for the student being late/absent, and provide an estimated time of arrival
* Pick one of the students with two parent records, use the app from one parent to reply to the notification. Use the second parent's app to send in a notification, he/she should get back a message saying the school has been notified already