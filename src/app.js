async function requestPatientData() {
  base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
  var immunization = await fetch(base_url+"/Patient/="+myApp.smart.patient.id,{
      headers: {
          Accept: "application/json+fhir",
          Authorization: "Bearer "+myApp.smart.state.tokenResponse.access_token
      }
  }).then(function(data){
      return data
  })

  var response = await immunization.json()
  console.log(response)
}  

/***** Patient object definition *****/
function defaultPatient() {
  return {
    // Patient data
    fname: { value: "" },
    lname: { value: "" },
    gender: { value: "" },
    birthdate: { value: "" },
  };
}

/***** HTML indexing *****/
window.drawVisualization = function (patient) {
  // Patient data
  $("#holder").show();
  $("#loading").hide();
  $("#fname").html(patient.fname);
  $("#lname").html(patient.lname);
  $("#gender").html(patient.gender);
  $("#birthdate").html(patient.birthdate);
};
