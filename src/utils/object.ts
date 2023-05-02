import _ from "lodash";
type Fields = Array<string>;
export const object = {
  isEqual: (obj1: object = {}, obj2: object = {}, ...fields: Fields) => {
    if (fields.length > 0) {
      return _.isEqual(_.pick(obj1, ...fields), _.pick(obj2, ...fields));
    }

    return _.isEqual(obj1, obj2);
  },
};
