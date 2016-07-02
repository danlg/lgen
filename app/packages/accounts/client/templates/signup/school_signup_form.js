Template.SchoolSignupForm.onRendered(function(){
    //log.info('SchoolSignupForm',this.inputBackgroundColor);
    //google blue 3E82F7
    this.defaultColor = '#3E82F7';
    this.inputBackgroundColor = new ReactiveVar(this.defaultColor);
    this.$('#school-background-color-picker-polyfill').spectrum({
        //color: Template.SignupMain.instanceinputBackgroundColor.get(),
        color: this.inputBackgroundColor.get(),
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        //palette: [["#3F5D7D","#279B61" ,"#008AB8","#993333","#A3E496","#95CAE4","#CC3333","#FFCC33","#CC6699"]],
        palette: [[
            "darkred", "lightgreen", "lightblue", "gold", "forestgreen", "purple", "orange", "pink", "mediumturquoise"]],
        showButtons: false
    });
});