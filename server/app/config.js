const config = {
  user: 'nagger',
  password: '123456',
  guest: 'guest',
  token: null,
  salt: '812032',
  secret: 'this_is_a_secret_hohoho_haha',

  dbTables: [
    {
      name: 'blog',
      createSql: `CREATE TABLE \`blog\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL DEFAULT '',
        \`content\` text NOT NULL,
        \`date\` varchar(20) NOT NULL DEFAULT '0000-00-00',
        \`category\` varchar(255) NOT NULL DEFAULT '',
        \`labels\` varchar(255) NOT NULL DEFAULT '',
        \`visit_cnt\` bigint(20) NOT NULL DEFAULT '0',
        \`gmt_create\` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        \`gmt_modify\` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        \`deleted\` tinyint(1) NOT NULL DEFAULT '0',
        \`private\` tinyint(3) NOT NULL DEFAULT '0',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`title_UNIQUE\` (\`title\`),
        UNIQUE KEY \`id_UNIQUE\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;`,
    },
    {
      name: 'category',
      createSql: `CREATE TABLE \`category\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL DEFAULT '',
          \`count\` int(11) NOT NULL DEFAULT '0',
          \`id_private\` tinyint(1) NOT NULL DEFAULT '0',
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`name\` (\`name\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;`,
    },
    {
      name: 'archive',
      createSql: `CREATE TABLE \`archive\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`date\` varchar(20) NOT NULL DEFAULT '0000-00',
          \`count\` int(11) NOT NULL DEFAULT '0',
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`date_UNIQUE\` (\`date\`),
          UNIQUE KEY \`id_UNIQUE\` (\`id\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;`,
    },
    {
      name: 'draft',
      createSql: `CREATE TABLE \`draft\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL DEFAULT '',
        \`content\` text NOT NULL,
        \`category\` varchar(255) NOT NULL DEFAULT '',
        \`labels\` varchar(255) NOT NULL DEFAULT '',
        \`gmt_create\` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        \`gmt_modify\` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        \`deleted\` tinyint(1) NOT NULL DEFAULT '0',
        \`private\` varchar(4) NOT NULL DEFAULT '0',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id_UNIQUE\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;`,
    },
    {
      name: 'label',
      createSql: `CREATE TABLE \`label\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL DEFAULT '',
          \`count\` int(11) NOT NULL DEFAULT '0',
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`name_UNIQUE\` (\`name\`),
          UNIQUE KEY \`id_UNIQUE\` (\`id\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;`,
    },
    {
      name: 'user',
      createSql: `CREATE TABLE \`user\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL DEFAULT 'admin',
          \`password\` varchar(255) NOT NULL DEFAULT '',
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
    },
  ],

}
module.exports = config
