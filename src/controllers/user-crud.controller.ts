// Uncomment these imports to begin using these cool features!

import { inject } from "@loopback/core";
import { del, get, param, patch, post, requestBody, response } from "@loopback/rest";
import { UserApiService, UserObject } from "../types";

export class UserCrudController {

  constructor(
    @inject('services.restDataSource') private restDataSourceService: UserApiService,
    @inject('services.openApiDataSource') private openApiService: UserApiService) {
  }

  @post('/openapi/users')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      }
    },
  })
  async create1(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            title: "New User",
            type: "object"
          },
        },
      },
    }) user: UserObject
  ): Promise<UserObject> {
    return this.openApiService.userControllerCreate({}, {
      requestBody: user,
      requestContentType: 'application/json'
    });
  }

  @get('/openapi/users/count')
  @response(200, {
    description: 'User model count',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      }
    },
  })
  async count1(
  ): Promise<UserObject> {
    return this.openApiService.userControllerCount({ where: '' });
  }
  @get('/openapi/users/{id}')
  @response(200, {
    description: 'GET User model instance',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      },
    },
  })
  async findById1(
    @param.path.number('id') id: number
  ): Promise<UserObject> {
    return this.openApiService.userControllerFindById({ id: id, filter: '' });
  }

  @patch('/openapi/users/{id}')
  @response(200, {
    description: 'Update User model count',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      }
    },
  })
  async updateById1(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: "object"
          }
        },
      },
    })
    user: UserObject,
  ): Promise<UserObject> {
    return this.openApiService.userControllerUpdateById({ id: id }, {
      requestBody: user,
      requestContentType: 'application/json'
    });
  }

  @del('/openapi/users/{id}')
  @response(200, {
    description: 'DELETE User model count',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      }
    },
  })
  async deleteById1(@param.path.number('id') id: number): Promise<UserObject> {
    return this.openApiService.userControllerDeleteById({ id: id, filter: '' });
  }

  @get('/openapi/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: "object"
          }
        },
      },
    },
  })
  async find1(
  ): Promise<UserObject[]> {
    return this.openApiService.userControllerFind({ filter: '' });
  }

  ///--------------------------------------------------------///
  @post('/rest/users')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      }
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            title: "New User",
            type: "object"
          },
        },
      },
    }) user: UserObject
  ): Promise<UserObject> {
    return this.restDataSourceService.createUser(user["firstName"], user["middleName"], user["lastName"], user["email"],
      user["address"], user["phoneNumber"], user["customerId"]);
  }

  @get('/rest/users/count')
  @response(200, {
    description: 'User model count',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      }
    },
  })
  async count(
  ): Promise<UserObject> {
    return this.restDataSourceService.getUsersCount();
  }
  @get('/rest/users/{id}')
  @response(200, {
    description: 'GET User model instance',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<UserObject> {
    return this.restDataSourceService.getUserById(id);
  }

  @patch('/rest/users/{id}')
  @response(200, {
    description: 'Update User model count',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      }
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: "object"
          }
        },
      },
    })
    user: UserObject,
  ): Promise<UserObject> {
    return this.restDataSourceService.updateUserById(id, user["firstName"], user["middleName"], user["lastName"], user["email"],
      user["address"], user["phoneNumber"], user["customerId"]);
  }

  @del('/rest/users/{id}')
  @response(200, {
    description: 'DELETE User model count',
    content: {
      'application/json': {
        schema: {
          type: "object"
        }
      }
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<UserObject> {
    return this.restDataSourceService.deleteUserById(id);
  }

  @get('/rest/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: "object"
          }
        },
      },
    },
  })
  async find(
  ): Promise<UserObject[]> {
    return this.restDataSourceService.getUsers();
  }
}
