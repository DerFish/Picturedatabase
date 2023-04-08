export function getEnvVariable(id) {
    var queryString = "";

    if (process.env.REACT_APP_LOCALAPI == null) {
        queryString = "Picture/GetEnvVariable" + "?id=" + id;
    }
    else {
        queryString = process.env.REACT_APP_LOCALAPI + "Picture/GetEnvVariable" + "?id=" + id;
    }

    return fetch(
        queryString
    ).then((resp) => {
        console.log(resp);
        return resp.json();
    })
        .catch((err) => {
            console.log("error");
            console.log(err);
        })
        .then((data) => {
            return data;
        });
}