import regression from 'regression';

export default function getRegression(records, independentName, dependentName, min, max) {
    let regressionValues = [];
    let result = [];
    for (let i = min; i < 24; i++) {
        if (records[i]) {
            regressionValues.push([parseInt(records[i][independentName]), parseInt(records[i][dependentName])]);
        }
    }
    const regressionResult = regression.linear(regressionValues);
    const gradient = regressionResult.equation[0];
    const yInt = regressionResult.equation[1];

    for (let i = min; i < max + 1; i++) {
        result.push(
            {
                [independentName]: i,
                [dependentName]: ((gradient * i) + yInt).toFixed(2),
            }
        )
    }
    return result;
}
