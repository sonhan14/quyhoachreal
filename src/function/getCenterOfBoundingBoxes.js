function getCenterOfBoundingBoxes(boundingBoxes) {
    let boundingTake = boundingBoxes;
    if (boundingBoxes.length > 3) {
        boundingTake = boundingBoxes.slice(-2);
    } else {
        boundingTake = boundingBoxes;
    }
    console.log(boundingTake);

    const minLon = Math.min(...boundingTake.map((box) => box[0]));
    const minLat = Math.min(...boundingTake.map((box) => box[1]));
    const maxLon = Math.max(...boundingTake.map((box) => box[2]));
    const maxLat = Math.max(...boundingTake.map((box) => box[3]));

    console.log("Min lon",minLon);
    console.log("Min lat",minLat);
    console.log("Max lon",maxLon);
    console.log("Max lat",maxLat);

    // Tính trung điểm
    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;
    // console.log([centerLon, centerLat], 'centerLon, centerLat');
    // console.log(boundingTake, 'boundingTake');
    return [centerLon, centerLat];
}

export default getCenterOfBoundingBoxes;

// function getCenterOfBoundingBoxes(boundingBoxes) {
//     const minLon = Math.min(...boundingBoxes.map((box) => box[0]));
//     const minLat = Math.min(...boundingBoxes.map((box) => box[1]));
//     const maxLon = Math.max(...boundingBoxes.map((box) => box[2]));
//     const maxLat = Math.max(...boundingBoxes.map((box) => box[3]));

//     // Tính trung điểm
//     const centerLon = (minLon + maxLon) / 2;
//     const centerLat = (minLat + maxLat) / 2;

//     // Tính khoảng cách theo trục kinh độ và dịch sang trái 20%
//     const offsetLon = (maxLon - minLon) * 0.2;
//     const adjustedCenterLon = centerLon - offsetLon;

//     // Tính khoảng cách theo trục vĩ độ và dịch lên trên 20%
//     const offsetLat = (maxLat - minLat) * 0.2;
//     const adjustedCenterLat = centerLat + offsetLat;

//     return [adjustedCenterLon, adjustedCenterLat];
// }

// export default getCenterOfBoundingBoxes;
