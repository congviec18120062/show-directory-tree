const tree = require("directory-tree"); // Get object of directory tree
const path = require("path"); // Make path
const treeify = require("treeify"); // Get tree from object

/**
 * Make nested object to nested array
 * @param {Object} obj This is object from directory-tree return
 */
let iteratorObj = function(obj) {
  let sample = [];
  if (obj.constructor != Array) {
    sample.push(obj.name);
  }

  for (let prop in obj) {
    let value = obj[prop];
    if (typeof value === "object") {
      sample.push(iteratorObj(value));
    }
  }
  return sample;
};

/**
 * Change nested array to object such as treeify can read
 * @param {Array} arr Array from iteratorObj return
 * @param {String} blackList Folder that not show directory default node_modules
 */
let arrToObj = function(arr, blackList) {
  let obj = {};
  if (arr.length == 0) {
    return null;
  } else if (arr.length == 1) {
    if (typeof arr[0] == "string") {
      obj[arr[0]] = null;
    } else {
      obj = Object.assign(obj, arrToObj(arr[0], blackList));
    }
  } else if (arr.length == 2) {
    if (typeof arr[0] == "string") {
      if (arr[0] == blackList) {
        obj[arr[0]] = {};
      } else {
        obj[arr[0]] = arrToObj(arr[1], blackList);
      }
    } else {
      obj = Object.assign(
        {},
        arrToObj(arr[0], blackList),
        arrToObj(arr[1], blackList)
      );
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      obj = Object.assign(obj, arrToObj(arr[i], blackList));
    }
  }
  return obj;
};

/**
 * Show directory tree from treeify return
 * @param {String} dir Full directory or folder name
 * @param {Boolean} folder Check dir is folder or directory
 * @param {String} blackList Folder which is not show in tree
 */
let showTree = function(dir, folder = false, blackList = "node_modules") {
  if (folder) {
    dir = path.join(process.cwd(), dir);
  }
  let obj = tree(dir);
  let arr = iteratorObj(obj);
  let obj1 = arrToObj(arr, blackList);
  console.log(treeify.asTree(obj1, true, false));
};

module.exports = showTree;
