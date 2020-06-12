import React, { useState, useEffect } from "react";
import moment from "moment";
import Box from "@material-ui/core/Box";
export default function DisplayCurrentBox(props) {
  const [data, setData] = useState(null);
  const sth = "something";

  useEffect(() => {
    if (props.data.length) {
      console.log(props.data);

      const d = filterForLocation(props.data).sort((a, b) =>
        moment(a.timestamp) > moment(b.timestamp) ? -1 : 1
      );
      console.log(d);
      setData(d[0].value);
    }
  }, [props.data]);
  // console.log({data});

  function filterForLocation(data) {
    const loc = props.location;
    return data.filter((d) => d.location == loc);
  }

  if (props.type === "temp") {
    return (
      <Box color="white" bgcolor="palevioletred" style={{textAlign: 'center'}}>
        {data && `${data}\u00b0C`}
      </Box>
    );
  } else if (props.type === "hum") {
    return (
      <Box color="white" bgcolor="royalblue" style={{textAlign: 'center'}}>
        {data && `${data}%`}
      </Box>
    );
  }
}
