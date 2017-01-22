/*
Very simple single page landing page automation with form validation using bootstrap v3 and jQuery
Author: L.Francisco
Date: 20/01/2017
Notes: Works for text fields only
Usage: Make sure input files type is set to "text" to prevent browser field validation
       Enable field validation by decorating the input field with data-js-validate="email/name/fullname/tel/url/number/date" attribute.
       Use "collapse" or "invisible" classes to hide the label error message to apper only when invalid 
*/

// Setup a callback on document ready
$(function() {

//--- Thank you Modal window pop-up on redirection ------------------------------------------------

  // Parse the URL paramenters
  var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
  
  // Shows the Modal window to thank you for subscribing (redirect from MailerLite)
  if(params["thankyou"])
    $('#thankyouModal').modal('show');

//--- Join us Modal Form automation -------------------------------------------------------------

  // Activate joinModal fields upon source button
  $('#joinModal').on('show.bs.modal', function (e) {
/*
    // Select radio button depending on arg
    switch( $(e.relatedTarget).attr('data-modal-arg') )
    {
        // Select 'career' radio button
        case 'career': $("#radio_career",this).prop('checked',true); break;

        // Select 'salon' radio button
        case 'salon': $("#radio_salon",this).prop('checked',true); break;
    }
*/
    // Keep track of the source to submit the info to MailerLite
    $("input[name='fields[source]']").val( $(e.relatedTarget).attr('data-modal-arg') );

    // Empty text fields
    $("input[type=text], textarea",this).val("");

    // Deactivate city label/button
    $("label.btn",this).removeClass('active');

    // Remove error related classes
    $(".form-group",this).removeClass('has-error has-feedback');

    // Hide the error labels 
    $("label.collapse",this).hide();

    // Fill-up the fields[city] hidden field for MailerLite form on city button clicks
    $('form .btn-city',this).click(function(e){     
         $("input[name='fields[city]']").val( $(this).attr('value') );
    });

    // Fill-up the fields[reason] hidden field for MailerLite form on reason radio clicks
    $('form input[type=radio]',this).click(function(e){
        $("input[name='fields[reason]']").val( $(this).val() );
    });

   });

//--- Form validation -------------------------------------------------------------

  // Hook on forms to validate text fields
  $("form").each(function(){

      // Replaces the submit event handler
      $(this).submit(function(e){

          var rxValidators = {
          'url'      : /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/,
          'email'    : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
          'fullname' : /^((?![0-9]).+\s.+)/g,
          'name'     : /^((?![0-9]).+)/g,
          'tel'      : /^[0-9\-\+]{3,25}$/,
          'number'   : /^[0-9]+/g,
          'date'     : /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
          };

          var invalid = false;

          // Cleanup previously decorated elements
          $('.has-error',this).removeClass('has-error has-feedback');
          $('.collapse',this).hide();

          // Hook on input fields of text type
          $("input[type='text']", this).each(function(){

            var input = $(this), rx = rxValidators[input.attr('data-js-validate').toLowerCase()];
            
            // Validate input fields matching "validate" attribute with the corresponding regular expression
            if(!rx.test(input.val()))
            {
                // Decorates the relevan form-group with bootstrap invalidity classes
                input.closest('.form-group').addClass('has-error');// has-feedback');

                // Show the label switching the display status (.collapse)
                $("label[for='" + input.attr('id') + "']").show();

                invalid = true; // Tracks for field invalidity
             }
          });

          // Prevent default behaviour in case of invalid fields
          if(invalid){
            e.preventDefault();}
      });
  });
});
