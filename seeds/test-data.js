const { hashPassword } = require('../src/utilities')

exports.seed = async function (knex) {
  await knex('posts').del()
  await knex('users').del()

  await knex('users').insert([
    { id: 1, email: 'franz@codecampleipzig.de', hashedPassword: await hashPassword('Lotte123') },
    { id: 2, email: 'gabe@codecampleipzig.de', hashedPassword: await hashPassword('Lotte123') },
    { id: 3, email: 'taylor@codecampleipzig.de', hashedPassword: await hashPassword('Lotte123') }
  ])

  await knex('posts').insert([{
    title: '10 Things You Need to Do Before Buying a House',
    content: `Bad news. Andy Griffith turned us down. He didn't like his trailer.
    Marry me. I don't criticize you! And if you're worried about criticism, sometimes a diet is the best defense. No! I was ashamed to be SEEN with you. I like being with you. Across from where? I'm a monster.`,
    userId: 1
  },
  {
    title: 'This is how parents can relieve stress throughout the day',
    content: `I'm the Doctor, I'm worse than everyone's aunt. *catches himself* And that is not how I'm introducing myself.
    Heh-haa! Super squeaky bum time! No, I'll fix it. I'm good at fixing rot. Call me the Rotmeister. No, I'm the Doctor. Don't call me the Rotmeister. The way I see it, every life is a pile of good things and bad things.…hey.…the good things don't always soften the bad things; but vice-versa the bad things don't necessarily spoil the good things and make them unimportant.`,
    userId: 3
  },
  {
    title: '50 Random Facts You Won’t Believe Are True',
    content: 'Please note that these licenses do allow commercial uses of your contributions, as long as the originator of its distribution, then any patent claim(s), now owned or controlled by Licensor, to make, use, sell, offer to sell, import and otherwise using this software without specific, written prior permission. Each new version of the Program, the Contributor who includes the Program under this license. Provisions that, by their nature, must remain in full compliance. Stated plainly: You are responsible for claims brought by a third party intellectual property rights (other than patent or other Digital Content within such NOTICE file, excluding those notices that do not forfeit any of the State of New Versions. Once Licensed Product as an Executable version does not create potential liability for other Contributors.',
    userId: 2
  }])
}
