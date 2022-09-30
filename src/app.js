async function requestPatientData(){
    base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
    var patient = await fetch(base_url+"/Patient/"+myApp.smart.patient.id,{
        headers: {
            Accept: "application/json+fhir",
            Authorization: "Bearer "+myApp.smart.state.tokenResponse.access_token
        }
    }).then(function(data){
        return data
    })

    var response = await patient.json
    console.log(response)
    $("#patient").text(JSON.stringify(response, null, '\t'))
}