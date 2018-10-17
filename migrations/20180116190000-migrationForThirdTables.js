'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('activity_tasks', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      name: {
          type: Sequelize.STRING
      },
      activityId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'activities',
              key: 'id'
          }
      },
      taskListId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'task_lists',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('assigned_game_message_roles', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      assignedGameMessageId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'assigned_game_messages',
              key: 'id'
          }
      },
      gameRoleId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'game_roles',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('check_list_tasks', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      taskId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'task_lists',
              key: 'id'
          }
      },
      checkListId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'checkLists',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('game_player_list_players', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      gamePlayerId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'game_players',
              key: 'id'
          }
      },
      gamePlayerListId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'game_player_lists',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('incident_locations', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      incidentId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'incidents',
              key: 'id'
          }
      },
      placeId: {
        type: Sequelize.STRING,
        index: true,
        references: {
              model: 'places',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('incident_type_categories', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      name: {
          type: Sequelize.STRING
      },
      type_id: {
          type: Sequelize.UUID,
          index: true
      },
      category_id: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'categories',
              key: 'id'
          }
      },
      userAccountId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'user_accounts',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('incident_types_checklists', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      categoryId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'categories',
              key: 'id'
          }
      },
      checkListId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'checkLists',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('incident_types_default_categories', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      categoryId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'categories',
              key: 'id'
          }
      },
      defaultCategoryId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'default_categories',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('message_historyHistories', {
      id: {
          type: Sequelize.UUID
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      content: {
          type: Sequelize.STRING
      },
      status: {
          type: Sequelize.BOOLEAN
      },
      modifiedAt: {
          type: Sequelize.DATE
      },
      owner: {
          type: Sequelize.INTEGER
      },
      index: {
          type: Sequelize.INTEGER
      },
      editorId: {
          type: Sequelize.UUID
      },
      classId: {
          type: Sequelize.UUID,
           references: {
              model: 'classes',
              key: 'id'
          }
      },
      messageId: {
          type: Sequelize.UUID
      },
      incidentId: {
          type: Sequelize.UUID,
          references: {
              model: 'incidents',
              key: 'id'
          }
      },
      hid: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
      },
      archivedAt: {
          type: Sequelize.DATE
      },
      selectedColor: {
          type: Sequelize.STRING
      }
    })

    queryInterface.createTable('messagesHistories', {
      id: {
          type: Sequelize.UUID
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      message: {
          type: Sequelize.STRING
      },
      coords: {
          type: Sequelize.JSON
      },
      status: {
          type: Sequelize.STRING
      },
      hid: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
      },
      archivedAt: {
          type: Sequelize.DATE
      }
    })

    queryInterface.createTable('session', {
      sid: {
          type: Sequelize.STRING,
          primaryKey: true
      },
      sess: {
          type: Sequelize.JSON
      },
      expire: {
          type: Sequelize.DATE
      }
    })

    queryInterface.createTable('task_tags', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      taskId: {
          type: Sequelize.UUID,
          index: true,
           references: {
              model: 'task_lists',
              key: 'id'
          }
      },
      tagId: {
        type: Sequelize.UUID,
        index: true,
         references: {
              model: 'tags',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('user_colors', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      userId: {
          type: Sequelize.UUID,
          index: true,
           references: {
              model: 'users',
              key: 'id'
          }
      },
      colorPaletteId: {
        type: Sequelize.UUID,
        index: true,
         references: {
              model: 'color_palettes',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('user_logs', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      action: {
          type: Sequelize.STRING
      },
      data: {
          type: Sequelize.JSON
      },
      userId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'users',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('user_roles', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      roleId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'roles',
              key: 'id'
          }
      },
      userId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'users',
              key: 'id'
          }
      }
    })

    queryInterface.createTable('user_teams', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      incidentsTeamId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'incidents_teams',
              key: 'id'
          }
      },
      userId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'users',
              key: 'id'
          }
      }
    })
    
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('activity_tasks')
      queryInterface.dropTable('assigned_game_message_roles')
      queryInterface.dropTable('check_list_tasks')
      queryInterface.dropTable('game_player_list_players')
      queryInterface.dropTable('incident_locations')
      queryInterface.dropTable('incident_type_categories')
      queryInterface.dropTable('incident_types_checklists')
      queryInterface.dropTable('incident_types_default_categories')
      queryInterface.dropTable('message_historyHistories')
      queryInterface.dropTable('messagesHistories')
      queryInterface.dropTable('session')
      queryInterface.dropTable('status_reports')
      queryInterface.dropTable('task_tags')
      queryInterface.dropTable('user_colors')
      queryInterface.dropTable('user_logs')
      queryInterface.dropTable('user_roles')
      queryInterface.dropTable('user_teams')
  }
};
