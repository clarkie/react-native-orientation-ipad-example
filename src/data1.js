export default [
   {
      composer: 'J. S. Bach',
      title: '1. Prélude',
      type: 'piece',
      parentProducts:
       [ { copyright: 'Copyright company',
           composer: 'J. S. Bach',
           description: '<p>Some desc</p>',
           title: 'English Suite No. 1 in A major BWV 806',
           type: 'volume',
           pieces:
            [ '2234',
              '1234' ],
           parentProducts:
            [ { volumes:
                 [ '123',
                   '234'],
                title: 'Piano Masterworks',
                type: 'collection',
                id: '1',
            } ]
      } ]
  },
  {
    composer: 'Chopin',
    title: '1. Waterfall',
    type: 'piece',
    parentProducts:
      [ { copyright: 'Copyright company',
        composer: 'Chopin',
        description: '<p>Some desc</p>',
        title: 'English Suite No. 1 in A major BWV 806',
        type: 'volume',
        pieces:
           [ '2234',
             '1234' ],
        parentProducts:
           [ { volumes: [ '123', '234'],
               title: 'Piano Masterworks',
               type: 'collection',
          id: '1'
      } ]
}]}];
