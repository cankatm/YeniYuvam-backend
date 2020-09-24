const graphql = require('graphql');

const Ad = require('../models/ad');
const User = require('../models/user');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const AdType = new GraphQLObjectType({
  name: 'Ad',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    userId: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    ads: {
      type: GraphQLList(AdType),
      resolve(parent, args) {
        return Ad.find({ userId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ad: {
      type: AdType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Ad.findById(args.id);
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    ads: {
      type: GraphQLList(AdType),
      resolve() {
        // return all ads;
        return Ad.find({});
      },
    },
    users: {
      type: GraphQLList(UserType),
      resolve() {
        // return all users;
        return User.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let user = new User({
          name: args.name,
          email: args.email,
        });

        return user.save();
      },
    },

    addAd: {
      type: AdType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let ad = new Ad({
          name: args.name,
          type: args.type,
          userId: args.userId,
        });

        return ad.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
