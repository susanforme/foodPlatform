export default {
  Mutation: {
    /**
     * Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
     * file.createReadStream() is a readable node stream that contains the contents of the uploaded file
     * node stream api: https://nodejs.org/api/stream.html
     */
    singleUpload(_: any, args: any) {
      return args.file.then((file: any) => {
        return file;
      });
    },
  },
};
