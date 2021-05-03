let table = require("cli-table");
var Log = require("log");
let log = new Log("debug");
let tableData = new table();

let enviromentVariables = {
  "APPLICATION_PORT" : {
    "message" : "Required port no",
    "optional" : false
  },
  "APPLICATION_ENV" : {
    "message" : "Required node environment",
    "optional" : false
  },
  "MONGODB_URL" : {
    "message" : "Required mongodb url",
    "optional" : false
  },
  "INTERNAL_ACCESS_TOKEN" : {
    "message" : "Required internal access token",
    "optional" : false
  },
  "CLOUD_STORAGE" : {
    "message" : "Enable/Disable cloud services",
    "optional" : false
  },
  "GCP_PATH" : {
    "message" : "Required Gcp path",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "GC"
    }
  },
  "GCP_BUCKET_NAME" : {
    "message" : "Required Gcp bucket name",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "GC"
    }
  },
  "AZURE_ACCOUNT_NAME" : {
    "message" : "Required Azure Account name",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "AZURE"
    }
  },
  "AZURE_ACCOUNT_KEY" : {
    "message" : "Required Azure Account key",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "AZURE"
    }
  },
  "AZURE_STORAGE_CONTAINER" :  {
    "message" : "Required Azure container",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "AZURE"
    }
  },
  "AWS_ACCESS_KEY_ID" : {
    "message" : "Required Aws access key id",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "AWS"
    }
  }, 
  "AWS_SECRET_ACCESS_KEY" : {
    "message" : "Required Aws secret access key",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "AWS"
    }
  }, 
  "AWS_BUCKET_NAME" : {
    "message" : "Required Aws bucket name",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "AWS"
    }
  }, 
  "AWS_BUCKET_REGION" : {
    "message" : "Required Aws bucket region",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "AWS"
    }
  }, 
  "AWS_BUCKET_ENDPOINT" : {
    "message" : "Required Aws bucket endpoint",
    "optional" : true,
    "requiredIf" : {
      "key": "CLOUD_STORAGE",
      "value" : "AWS"
    }
  }, 
  "KEYCLOAK_PUBLIC_KEY_PATH" : {
    "message" : "Required keycloak public key path",
    "optional" : false
  },
  "ML_SURVEY_SERVICE_URL" : {
    "message" : "Required survey service API endpoint",
    "optional" : false
  },
  "ML_PROJECT_SERVICE_URL" : {
    "message" : "Required project service API endpoint",
    "optional" : false
  },
  "ELASTICSEARCH_COMMUNICATIONS_ON_OFF" : {
    "message" : "Enable/Disable elastic search communications",
    "optional" : false
  },
  "ELASTICSEARCH_HOST_URL" : {
    "message" : "Elastic search host url",
    "optional" : false
  },
  "ELASTICSEARCH_ENTITIES_INDEX" : {
    "message" : "Elastic search entities index",
    "optional" : false
  },
  "USER_SERVICE_URL" : {
    "message" : "Sunbird environment base url",
    "optional" : false
  }
}

let success = true;

module.exports = function() {
  Object.keys(enviromentVariables).forEach(eachEnvironmentVariable=>{
  
    let tableObj = { [eachEnvironmentVariable] : "PASSED" };

    if( 
      enviromentVariables[eachEnvironmentVariable].requiredIf
      && process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] 
      && process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] === enviromentVariables[eachEnvironmentVariable].requiredIf.value
    ) {
      enviromentVariables[eachEnvironmentVariable].optional = false;
    }
  
    if( 
      !process.env[eachEnvironmentVariable] && 
      !(enviromentVariables[eachEnvironmentVariable].optional)
    ) {
      
      success = false;

      if( 
        enviromentVariables[eachEnvironmentVariable].default &&
        enviromentVariables[eachEnvironmentVariable].default != "" 
      ) {
        process.env[eachEnvironmentVariable] = 
        enviromentVariables[eachEnvironmentVariable].default;
      }

      if(
        enviromentVariables[eachEnvironmentVariable] && 
        enviromentVariables[eachEnvironmentVariable].message !== ""
      ) {
        tableObj[eachEnvironmentVariable] = 
        enviromentVariables[eachEnvironmentVariable].message;
      } else {
        tableObj[eachEnvironmentVariable] = "required";
      }

    } else {

      tableObj[eachEnvironmentVariable] = "Passed";
      
      if( 
        enviromentVariables[eachEnvironmentVariable].possibleValues &&
        !enviromentVariables[eachEnvironmentVariable].possibleValues.includes(process.env[eachEnvironmentVariable])
      ) {
        tableObj[eachEnvironmentVariable] = ` Valid values - ${enviromentVariables[eachEnvironmentVariable].possibleValues.join(", ")}`;
      }
      
    }

    tableData.push(tableObj);
  })

  log.info(tableData.toString());

  return {
    success : success
  }
}
