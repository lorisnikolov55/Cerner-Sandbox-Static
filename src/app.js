async function requestPatientData() {
    base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
    var patient = await fetch(base_url+"/Patient/"+myApp.smart.patient.id,{
        headers: {
            Accept: "application/json+fhir",
            Authorization: "Bearer "+myApp.smart.state.tokenResponse.access_token
        }
    })

    var response = await patient.json() 
    console.log(response)

    var fname = response.name[0].given[0]
    var lname = response.name[0].family[0]
    var gender = response.gender
    
    var dob = new Date(patient.birthDate);
    var day = dob.getDate();
    var monthIndex = dob.getMonth() + 1;
    var year = dob.getFullYear();

    var dobStr = monthIndex + "/" + day + "/" + year;

    var p = defaultPatient()
    p.fname = fname
    p.lname = lname
    p.gender = gender
    p.birthdate = dobStr
    
    return p
}        

/***** Patient object definition *****/
function defaultPatient() {
    return {
      // Patient data
      fname: { value: "" },
      lname: { value: "" },
      gender: { value: "" },
      birthdate: { value: "" },
    }
}