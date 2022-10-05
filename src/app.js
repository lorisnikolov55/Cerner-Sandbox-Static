async function requestPatientData() {
  const base_url =
    "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d";
  var patient = await fetch(base_url + "/Patient/" + myApp.smart.patient.id, {
    headers: {
      Accept: "application/json+fhir",
      Authorization: "Bearer " + myApp.smart.state.tokenResponse.access_token,
    },
  }).then(function (data) {
    return data;
  });

  var patientData = await patient.json();
  console.log(patientData);

  var gender = patientData.gender;
  var dob = new Date(patientData.birthDate);
  var day = dob.getDate();
  var monthIndex = dob.getMonth() + 1;
  var year = dob.getFullYear();

  var dobStr = monthIndex + "/" + day + "/" + year;
  var fname = "";
  var lname = "";

  if (typeof patientData.name[0] !== "undefined") {
    fname = patientData.name[0].given.join(" ");
    lname = patientData.name[0].family.join(" ");
  }

  var p = defaultPatient();
  p.birthdate = dobStr;
  p.gender = gender;
  p.fname = fname;
  p.lname = lname;

  return p;
}

async function requestImmunizationData() {
  const base_url =
    "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d";
  var immunization = await fetch(
    base_url + "/Immunization?patient=" + myApp.smart.patient.id,
    {
      headers: {
        Accept: "application/json+fhir",
        Authorization: "Bearer " + myApp.smart.state.tokenResponse.access_token,
      },
    }
  ).then(function (data) {
    return data;
  });

  var immunizationData = await immunization.json();
  console.log(immunizationData.entry[0]);

  if (immunizationData.entry[0].resource.hasOwnProperty("vaccineCode")) {
    var vaccineCode = immunizationData.entry[0].resource.vaccineCode.text;
    console.log(vaccineCode);
  } else {
    var vaccineCode = "NA";
    console.log(vaccineCode);
  }

  if (immunizationData.entry[0].resource.hasOwnProperty("manufacturer")) {
    var vaccineManufacturer = immunizationData.entry[0].resource.manufacturer.display;
    console.log(vaccineManufacturer);
  } else {
    var vaccineManufacturer = "NA";
    console.log(vaccineManufacturer);
  }

  if (immunizationData.entry[0].resource.hasOwnProperty("status")) {
    var vaccineStatus = immunizationData.entry[0].resource.status;
    console.log(vaccineStatus);
  } else {
    var vaccineStatus = "NA";
    console.log(vaccineStatus);
  }

  if (immunizationData.entry[0].resource.hasOwnProperty("doseQuantity")) {
    if (
      typeof String(immunizationData.entry[0].resource.doseQuantity.value) ||
      immunizationData.entry[0].resource.doseQuantity.unit !== "unknown unit"
    ) {
      var doseQuantity =
        String(immunizationData.entry[0].resource.doseQuantity.value) +
        " " +
        immunizationData.entry[0].resource.doseQuantity.unit;
      console.log(doseQuantity);
    } else {
      var doseQuantity = "NA";
      console.log(doseQuantity);
    }
  } else {
    var doseQuantity = "NA";
    console.log(doseQuantity);
  }

  if (immunizationData.entry[0].resource.hasOwnProperty("date")) {
    var dateGiven = immunizationData.entry[0].resource.date;
    console.log(dateGiven);
  } else {
    var dateGiven = "NA";
    console.log(dateGiven);
  }

  if (immunizationData.entry[0].resource.hasOwnProperty("expirationDate")) {
    var expiryDate = immunizationData.entry[0].resource.expirationDate;
    console.log(expiryDate);
  } else {
    var expiryDate = "NA";
    console.log(expiryDate);
  }

  var i = defaultImmunization();
  i.vCode = vaccineCode;
  i.vManufacturer = vaccineManufacturer;
  i.vStatus = vaccineStatus;
  i.vDoseQuantity = doseQuantity;
  i.vDateGiven = dateGiven;
  i.vExpiryDate = expiryDate;

  return i;
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

/***** Immunization object definition *****/
function defaultImmunization() {
  return {
    // Immunization data
    vCode: { value: "" },
    vManufacturer: { value: "" },
    vStatus: { value: "" },
    vDoseQuantity: { value: "" },
    vDateGiven: { value: "" },
    vExpiryDate: { value: "" },
  };
}

/***** HTML indexing patients *****/
function drawPatient(p) {
  // Patient data
  $("#holder").show();
  $("#loading").hide();
  $("#fname").html(p.fname);
  $("#lname").html(p.lname);
  $("#gender").html(p.gender);
  $("#birthdate").html(p.birthdate);
}

/***** HTML indexing immunizations *****/
function drawImmunization(i) {
  // Immunization data
  $("#holder").show();
  $("#loading").hide();
  $("#type").html(i.vCode);
  $("#manufacturer").html(i.vManufacturer);
  $("#status").html(i.vStatus);
  $("#quantity").html(i.vDoseQuantity);
  $("#dateGiven").html(i.vDateGiven);
  $("#expiryDate").html(i.vExpiryDate);
}
