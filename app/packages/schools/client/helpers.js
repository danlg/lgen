SmartixSchools = SmartixSchools || {};

//file path is passed to insert the image. template is passed from template events
//so as to set reactiveVar as newly uploaded file's id
SmartixSchools.editLogo = function(filePath,template) {
    
    Images.insert(filePath, function(err, fileObj) {
        if (err) log.error(err);
        else {
            log.info(fileObj);
            
            //if there is a reactiveVar named newSchoolLogo
            if(template && template.newSchoolLogo){
                template.newSchoolLogo.set(fileObj._id);
            }
                    
        }
    });
};

SmartixSchools.editBackgroundImage = function(filePath,template) {
    
    Images.insert(filePath, function(err, fileObj) {
        if (err) log.error(err);
        else {
            log.info(fileObj);
            
            //if there is a reactiveVar named newSchoolBackgroundImage
            if(template && template.newSchoolBackgroundImage){
                template.newSchoolBackgroundImage.set(fileObj._id);
            }
                    
        }
    });
};