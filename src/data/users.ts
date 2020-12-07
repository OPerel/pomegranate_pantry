import { User } from '../types/interfaces';

const users: User[] = [
  {
    _id: 'a',
    name: 'Ori',
    role: 'user',
    location: 'TA'
  },
  {
    _id: 'b',
    name: 'Gal',
    role: 'user',
    location: 'PH'
  },
  {
    _id: 'c',
    name: 'Ben',
    role: 'user',
    location: 'TA'
  }
]

export const getUsers = () => users;

export const getUser = (_id: string) => users.filter(u => u._id === _id)[0];