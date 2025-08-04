{
  "success": true,
  "message": "Email Client API",
  "version": "1.0.0",
  "baseUrl": "http://email-list-api.onrender.com",
  "authentication": {
    "type": "Bearer Token",
    "header": "Authorization: Bearer \u003Ctoken\u003E",
    "note": "Required for all protected endpoints"
  },
  "pagination": {
    "parameters": "?page=1&limit=15",
    "description": "Use page and limit query parameters for pagination"
  },
  "filtering": {
    "description": "Use query parameters for filtering emails",
    "examples": {
      "view": "?view=inbox|starred|important|unread|sent|drafts|trash",
      "labels": "?labels=work,personal",
      "search": "?search=meeting",
      "dateRange": "?dateFrom=2024-01-01&dateTo=2024-01-31"
    }
  },
  "dataRetention": "48 hours",
  "endpoints": {
    "auth": {
      "register": {
        "method": "POST",
        "path": "/api/auth/register",
        "description": "Register a new user",
        "request": {
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "email": "user@example.com",
            "password": "securepassword123",
            "name": "John Doe",
            "role": "user"
          }
        },
        "response": {
          "success": {
            "status": 201,
            "body": {
              "success": true,
              "data": {
                "id": "user-123",
                "email": "user@example.com",
                "name": "John Doe",
                "role": "user",
                "avatar": null,
                "createdAt": "2024-01-01T00:00:00.000Z",
                "updatedAt": "2024-01-01T00:00:00.000Z"
              },
              "message": "User registered successfully"
            }
          },
          "error": {
            "status": 400,
            "body": {
              "success": false,
              "error": "Email already exists"
            }
          }
        }
      },
      "login": {
        "method": "POST",
        "path": "/api/auth/login",
        "description": "Login user",
        "request": {
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "email": "user@example.com",
            "password": "securepassword123"
          }
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "user": {
                  "id": "user-123",
                  "email": "user@example.com",
                  "name": "John Doe",
                  "role": "user",
                  "avatar": null,
                  "createdAt": "2024-01-01T00:00:00.000Z",
                  "updatedAt": "2024-01-01T00:00:00.000Z"
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              },
              "message": "Login successful"
            }
          },
          "error": {
            "status": 401,
            "body": {
              "success": false,
              "error": "Invalid credentials"
            }
          }
        }
      },
      "profile": {
        "method": "GET",
        "path": "/api/auth/profile",
        "description": "Get user profile",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "user-123",
                "name": "John Doe",
                "email": "user@example.com",
                "role": "user",
                "avatar": null,
                "unreadMessages": 5,
                "unreadNotifications": 2
              }
            }
          }
        }
      },
      "updateProfile": {
        "method": "PUT",
        "path": "/api/auth/profile",
        "description": "Update user profile",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E",
          "Content-Type": "application/json"
        },
        "request": {
          "body": {
            "name": "John Smith",
            "avatar": "https://example.com/avatar.jpg"
          }
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "user-123",
                "name": "John Smith",
                "email": "user@example.com",
                "role": "user",
                "avatar": "https://example.com/avatar.jpg",
                "unreadMessages": 5,
                "unreadNotifications": 2
              },
              "message": "Profile updated successfully"
            }
          }
        }
      },
      "changePassword": {
        "method": "PUT",
        "path": "/api/auth/change-password",
        "description": "Change user password",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E",
          "Content-Type": "application/json"
        },
        "request": {
          "body": {
            "currentPassword": "oldpassword123",
            "newPassword": "newpassword456"
          }
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "message": "Password changed successfully"
            }
          },
          "error": {
            "status": 400,
            "body": {
              "success": false,
              "error": "Current password is incorrect"
            }
          }
        }
      }
    },
    "emails": {
      "getEmails": {
        "method": "GET",
        "path": "/api/emails",
        "description": "Get emails with filtering and pagination",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "query": {
          "page": "1",
          "limit": "15",
          "view": "inbox",
          "labels": "work,personal",
          "search": "meeting",
          "isRead": "false",
          "isStarred": "true",
          "isImportant": "false",
          "hasAttachments": "true",
          "dateFrom": "2024-01-01",
          "dateTo": "2024-01-31",
          "sortBy": "timestamp",
          "sortOrder": "desc"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": [
                {
                  "id": "email-123",
                  "userId": "user-123",
                  "from": "sender@example.com",
                  "to": "user@example.com",
                  "subject": "Meeting Tomorrow",
                  "body": "Hi, let's meet tomorrow at 2 PM...",
                  "isRead": false,
                  "isStarred": true,
                  "isImportant": false,
                  "hasAttachments": true,
                  "attachments": [
                    {
                      "id": "att-123",
                      "emailId": "email-123",
                      "filename": "meeting-notes.pdf",
                      "size": 1024000,
                      "type": "application/pdf",
                      "url": "/uploads/meeting-notes.pdf"
                    }
                  ],
                  "labels": [
                    "work",
                    "meeting"
                  ],
                  "timestamp": "2024-01-15T10:30:00.000Z",
                  "createdAt": "2024-01-15T10:30:00.000Z",
                  "updatedAt": "2024-01-15T10:30:00.000Z"
                }
              ],
              "pagination": {
                "page": 1,
                "limit": 15,
                "total": 45,
                "totalPages": 3
              }
            }
          }
        }
      },
      "getEmailCounts": {
        "method": "GET",
        "path": "/api/emails/counts",
        "description": "Get email counts by view",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "inbox": 25,
                "starred": 8,
                "important": 12,
                "unread": 15,
                "sent": 30,
                "drafts": 3,
                "trash": 5
              }
            }
          }
        }
      },
      "getEmailById": {
        "method": "GET",
        "path": "/api/emails/:id",
        "description": "Get specific email",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "email-123",
                "userId": "user-123",
                "from": "sender@example.com",
                "to": "user@example.com",
                "subject": "Meeting Tomorrow",
                "body": "Hi, let's meet tomorrow at 2 PM...",
                "isRead": false,
                "isStarred": true,
                "isImportant": false,
                "hasAttachments": true,
                "attachments": [
                  {
                    "id": "att-123",
                    "emailId": "email-123",
                    "filename": "meeting-notes.pdf",
                    "size": 1024000,
                    "type": "application/pdf",
                    "url": "/uploads/meeting-notes.pdf"
                  }
                ],
                "labels": [
                  "work",
                  "meeting"
                ],
                "timestamp": "2024-01-15T10:30:00.000Z",
                "createdAt": "2024-01-15T10:30:00.000Z",
                "updatedAt": "2024-01-15T10:30:00.000Z"
              }
            }
          }
        }
      },
      "markAsRead": {
        "method": "PATCH",
        "path": "/api/emails/:id/read",
        "description": "Mark email as read",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "email-123",
                "isRead": true
              },
              "message": "Email marked as read"
            }
          }
        }
      },
      "toggleStar": {
        "method": "PATCH",
        "path": "/api/emails/:id/star",
        "description": "Toggle email star",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "email-123",
                "isStarred": true
              },
              "message": "Email starred"
            }
          }
        }
      },
      "toggleImportant": {
        "method": "PATCH",
        "path": "/api/emails/:id/important",
        "description": "Toggle email important",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "email-123",
                "isImportant": true
              },
              "message": "Email marked as important"
            }
          }
        }
      },
      "addLabel": {
        "method": "PATCH",
        "path": "/api/emails/:id/labels/add",
        "description": "Add label to email",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E",
          "Content-Type": "application/json"
        },
        "request": {
          "body": {
            "labelId": "label-123"
          }
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "email-123",
                "labels": [
                  "work",
                  "meeting",
                  "important"
                ]
              },
              "message": "Label added to email"
            }
          }
        }
      },
      "removeLabel": {
        "method": "PATCH",
        "path": "/api/emails/:id/labels/remove",
        "description": "Remove label from email",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E",
          "Content-Type": "application/json"
        },
        "request": {
          "body": {
            "labelId": "label-123"
          }
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "email-123",
                "labels": [
                  "work",
                  "meeting"
                ]
              },
              "message": "Label removed from email"
            }
          }
        }
      },
      "getLabels": {
        "method": "GET",
        "path": "/api/emails/labels",
        "description": "Get email labels",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": [
                {
                  "id": "label-123",
                  "userId": "user-123",
                  "name": "Work",
                  "color": "#ff6b6b"
                },
                {
                  "id": "label-456",
                  "userId": "user-123",
                  "name": "Personal",
                  "color": "#4ecdc4"
                }
              ]
            }
          }
        }
      },
      "createLabel": {
        "method": "POST",
        "path": "/api/emails/labels",
        "description": "Create email label",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E",
          "Content-Type": "application/json"
        },
        "request": {
          "body": {
            "name": "Project Alpha",
            "color": "#ff6b6b"
          }
        },
        "response": {
          "success": {
            "status": 201,
            "body": {
              "success": true,
              "data": {
                "id": "label-789",
                "userId": "user-123",
                "name": "Project Alpha",
                "color": "#ff6b6b"
              },
              "message": "Label created successfully"
            }
          }
        }
      },
      "deleteLabel": {
        "method": "DELETE",
        "path": "/api/emails/labels/:id",
        "description": "Delete email label",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "message": "Label deleted successfully"
            }
          }
        }
      },
      "deleteEmail": {
        "method": "DELETE",
        "path": "/api/emails/:id",
        "description": "Delete email",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "message": "Email deleted successfully"
            }
          }
        }
      }
    },
    "navigation": {
      "getItems": {
        "method": "GET",
        "path": "/api/navigation/items",
        "description": "Get navigation items",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": [
                {
                  "id": "nav-1",
                  "name": "Inbox",
                  "icon": "inbox",
                  "path": "/inbox",
                  "children": []
                },
                {
                  "id": "nav-2",
                  "name": "Starred",
                  "icon": "star",
                  "path": "/starred",
                  "children": []
                },
                {
                  "id": "nav-3",
                  "name": "Important",
                  "icon": "important",
                  "path": "/important",
                  "children": []
                }
              ]
            }
          }
        }
      },
      "getUpgradeInfo": {
        "method": "GET",
        "path": "/api/navigation/upgrade-info",
        "description": "Get upgrade information",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "currentPlan": "free",
                "features": [
                  "Up to 100 emails",
                  "Basic labels",
                  "Standard support"
                ],
                "upgradeUrl": "https://example.com/upgrade"
              }
            }
          }
        }
      }
    },
    "notifications": {
      "getNotifications": {
        "method": "GET",
        "path": "/api/notifications/notifications",
        "description": "Get notifications",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "query": {
          "page": "1",
          "limit": "10"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": [
                {
                  "id": "notif-123",
                  "userId": "user-123",
                  "title": "New Email",
                  "message": "You have received a new email from john@example.com",
                  "type": "info",
                  "isRead": false,
                  "timestamp": "2024-01-15T10:30:00.000Z"
                }
              ],
              "pagination": {
                "page": 1,
                "limit": 10,
                "total": 25,
                "totalPages": 3
              }
            }
          }
        }
      },
      "getUnreadCount": {
        "method": "GET",
        "path": "/api/notifications/notifications/unread-count",
        "description": "Get unread notification count",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "count": 5
              }
            }
          }
        }
      },
      "markAsRead": {
        "method": "PATCH",
        "path": "/api/notifications/notifications/:id/read",
        "description": "Mark notification as read",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "notif-123",
                "isRead": true
              },
              "message": "Notification marked as read"
            }
          }
        }
      },
      "markAllAsRead": {
        "method": "PATCH",
        "path": "/api/notifications/notifications/mark-all-read",
        "description": "Mark all notifications as read",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "message": "All notifications marked as read"
            }
          }
        }
      },
      "deleteNotification": {
        "method": "DELETE",
        "path": "/api/notifications/notifications/:id",
        "description": "Delete notification",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "message": "Notification deleted successfully"
            }
          }
        }
      },
      "getMessages": {
        "method": "GET",
        "path": "/api/notifications/messages",
        "description": "Get messages",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "query": {
          "page": "1",
          "limit": "10"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": [
                {
                  "id": "msg-123",
                  "userId": "user-123",
                  "title": "Welcome to Email Client",
                  "content": "Welcome to your new email client!",
                  "type": "system",
                  "isRead": false,
                  "timestamp": "2024-01-15T10:30:00.000Z"
                }
              ],
              "pagination": {
                "page": 1,
                "limit": 10,
                "total": 15,
                "totalPages": 2
              }
            }
          }
        }
      },
      "getUnreadMessageCount": {
        "method": "GET",
        "path": "/api/notifications/messages/unread-count",
        "description": "Get unread message count",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "count": 3
              }
            }
          }
        }
      },
      "markMessageAsRead": {
        "method": "PATCH",
        "path": "/api/notifications/messages/:id/read",
        "description": "Mark message as read",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "data": {
                "id": "msg-123",
                "isRead": true
              },
              "message": "Message marked as read"
            }
          }
        }
      },
      "markAllMessagesAsRead": {
        "method": "PATCH",
        "path": "/api/notifications/messages/mark-all-read",
        "description": "Mark all messages as read",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "message": "All messages marked as read"
            }
          }
        }
      },
      "deleteMessage": {
        "method": "DELETE",
        "path": "/api/notifications/messages/:id",
        "description": "Delete message",
        "headers": {
          "Authorization": "Bearer \u003Ctoken\u003E"
        },
        "response": {
          "success": {
            "status": 200,
            "body": {
              "success": true,
              "message": "Message deleted successfully"
            }
          }
        }
      }
    }
  },
  "errorResponses": {
    "400": {
      "description": "Bad Request",
      "example": {
        "success": false,
        "error": "Invalid request parameters"
      }
    },
    "401": {
      "description": "Unauthorized",
      "example": {
        "success": false,
        "error": "Authentication required"
      }
    },
    "403": {
      "description": "Forbidden",
      "example": {
        "success": false,
        "error": "Access denied"
      }
    },
    "404": {
      "description": "Not Found",
      "example": {
        "success": false,
        "error": "Resource not found"
      }
    },
    "500": {
      "description": "Internal Server Error",
      "example": {
        "success": false,
        "error": "Internal server error"
      }
    }
  }
}
