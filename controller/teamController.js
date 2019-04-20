const TeamModel = require('../modules/teamModel');

class TeamController {
    /**
     * 创建team
     */
    static async createGroup(ctx) {
        // 接收客服端
        let req = ctx.request.body;
        if (req.team_name
            && req.leader
        ) {
            try {
                const ret = await TeamModel.createTeam(req);
                // 把刚刚新建的文章ID查询文章详情，且返回新创建的文章信息
                const data = await TeamModel.getTeamByTeamId(ret.team_id);

                ctx.response.status = 200;
                ctx.body = {
                    code: 200,
                    msg: '创建team成功',
                    data: data
                }

            } catch (err) {
                ctx.response.status = 412;
                ctx.body = {
                    code: 412,
                    msg: '创建team失败',
                    data: err
                }
            }
        } else {
            ctx.response.status = 416;
            ctx.body = {
                code: 416,
                msg: '参数不齐全',
            }
        }

    }

    // 200 成功，412 异常
    static async getGroupByGroupId(team_id) {
        let result = null;
        try {
            let data = await TeamModel.getTeamByTeamId(team_id);
            result = {
                code: 200,
                msg: '查询成功',
                data: data
            };
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常
    static async getGroupByGroupName(team_name) {
        let result = null;
        try {
            let data = await TeamModel.getTeamByName(team_name);
            result = {
                code: 200,
                msg: '查询成功',
                data: data
            };
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常
    static async getGroupByTag(tag) {
        let result = null;
        try {
            let data = await TeamModel.getTeamByLabel(tag);

            result = {
                code: 200,
                msg: '查询成功',
                data: data
            };
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常
    static async getGroupByUsername(member_username) {
        let result = null;
        try {
            let data = await TeamModel.getTeamByUsername(member_username);
            result = {
                code: 200,
                msg: '查询成功',
                data: data
            };
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常
    static async getMembersByGroupId(team_id) {
        let result = null;
        try {
            let data = await TeamModel.getUserByTeamId(team_id);
            result = {
                code: 200,
                msg: '查询成功',
                data: data
            };

        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功是组长，412 异常， 413 不是组长
    static async isGroupLeader(team_id, leader) {
        let result = null;
        try {
            let team = await TeamModel.getTeamByTeamId(team_id);
            if (team.leader !== leader) {
                result = {
                    code: 413,
                    msg: '查询成功',
                    data: false
                };
            } else {
                result = {
                    code: 200,
                    msg: '查询成功',
                    data: true
                };
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功是成员，412 异常， 413 不是成员
    static async isGroupMember(team_id, member_username) {
        let result = null;
        try {
            let team = await TeamModel.getUserByTeamIdUsername(team_id, member_username);
            if (team.length === 0) {
                result = {
                    code: 413,
                    msg: '查询成功',
                    data: false
                };
            } else {
                result = {
                    code: 200,
                    msg: '查询成功',
                    data: true
                };
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            };
        }
        return result;
    }

    // 200 正常，412 异常，413 需要组长验证,414 不允许添加
    static async addUserToGrope(team_id, leader, username) {
        let result = null;
        try {
            let team = await TeamModel.getTeamByTeamId(team_id);
            if (team === null) {
                result = {
                    code: 412,
                    msg: '没有该小组',
                    data: false
                };
            } else if (team.limit === 0) {
                let user = await TeamModel.getUserByUsername(username);
                if (user === null) {
                    result = {
                        code: 412,
                        msg: '添加失败，没有user',
                        data: false
                    };
                } else {
                    let team = await TeamModel.getUserByTeamIdUsername(team_id, username);
                    if (team.length === 0) {
                        await TeamModel.createMembers(team_id, username);
                        result = {
                            code: 200,
                            msg: '添加成功',
                            data: true
                        };
                    } else {
                        result = {
                            code: 412,
                            msg: '添加失败，user已经在小组中',
                            data: false
                        };
                    }
                }
            } else if (team.limit === 1) {
                let isLeader = await TeamModel.getTeamByTeamId(team_id);
                if (isLeader.leader === leader) {
                    let user = await TeamModel.getUserByUsername(username);
                    if (user === null) {
                        result = {
                            code: 412,
                            msg: '添加失败，没有user',
                            data: false
                        };
                    } else {
                        let team = await TeamModel.getUserByTeamIdUsername(team_id, username);
                        if (team.length === 0) {
                            await TeamModel.createMembers(team_id, username);
                            result = {
                                code: 200,
                                msg: '添加成功',
                                data: true
                            };
                        } else {
                            result = {
                                code: 412,
                                msg: '添加失败，user已经在小组中',
                                data: false
                            };
                        }
                    }
                } else {
                    result = {
                        code: 413,
                        msg: '添加失败，leader不是组长, 需要验证',
                        data: false
                    };
                }
            } else if (team.limit === 2) {
                result = {
                    code: 414,
                    msg: '添加失败，该小组不允许添加',
                    data: false
                };
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '添加失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常，413 需要组长审核，414 不允许添加
    static async addUserToGrope2(team_id, username) {
        let result = null;
        try {
            let team = await TeamModel.getTeamByTeamId(team_id);
            if (team === null) {
                result = {
                    code: 412,
                    msg: '没有该小组',
                    data: false
                };
            } else if (team.limit === 0) {
                let user = await TeamModel.getUserByUsername(username);
                if (user === null) {
                    result = {
                        code: 412,
                        msg: '添加失败，没有user',
                        data: false
                    };
                } else {
                    let team = await TeamModel.getUserByTeamIdUsername(team_id, username);
                    if (team.length === 0) {
                        await TeamModel.createMembers(team_id, username);
                        result = {
                            code: 200,
                            msg: '添加成功',
                            data: true
                        };
                    } else {
                        result = {
                            code: 412,
                            msg: '添加失败，user已经在小组中',
                            data: false
                        };
                    }
                }
            } else if (team.limit === 1) {
                let user = await TeamModel.getUserByUsername(username);
                if (user === null) {
                    result = {
                        code: 412,
                        msg: '添加失败，没有user',
                        data: false
                    };
                } else {
                    let team = await TeamModel.getUserByTeamIdUsername(team_id, username);
                    if (team.length === 0) {
                        result = {
                            code: 413,
                            msg: '添加失败，需要组长审核',
                            data: true
                        };
                    } else {
                        result = {
                            code: 412,
                            msg: '添加失败，user已经在小组中',
                            data: false
                        };
                    }
                }
            } else if (team.limit === 2) {
                result = {
                    code: 414,
                    msg: '添加失败，该小组不允许添加',
                    data: false
                };
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '添加失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常,413 组长不正确
    static async deleteUserFromGrope(team_id, leader, username) {
        let result = null;
        try {
            let isLeader = await TeamModel.getTeamByTeamId(team_id);
            if (isLeader.leader === leader) {
                let team = await TeamModel.getUserByTeamIdUsername(team_id, username);
                if (team.length === 0) {
                    result = {
                        code: 412,
                        msg: '删除失败，user不在小组中',
                        data: false
                    };
                } else {
                    await TeamModel.deleteMember(team_id, username);
                    result = {
                        code: 200,
                        msg: '删除成功',
                        data: true
                    };
                }
            } else {
                result = {
                    code: 413,
                    msg: '删除失败，leader不是组长',
                    data: false
                };
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '删除失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常,413 成员不正确
    static async deleteUserFromGrope2(team_id, username) {
        let result = null;
        try {
                let team = await TeamModel.getUserByTeamIdUsername(team_id, username);
                if (team.length === 0) {
                    result = {
                        code: 413,
                        msg: '删除失败，user不在小组中',
                        data: false
                    };
                } else {
                    await TeamModel.deleteMember(team_id, username);
                    result = {
                        code: 200,
                        msg: '删除成功',
                        data: true
                    };
                }
        } catch (err) {
            result = {
                code: 412,
                msg: '删除失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常,413 组长不正确,414 成员不正确
    static async updateTeamLeader(team_id, leader, username) {
        let result = null;
        try {
            let isLeader = await TeamModel.getTeamByTeamId(team_id);
            if (isLeader.leader === leader) {
                let isMember = await TeamModel.getUserByTeamIdUsername(team_id, username);
                if (isMember.length === 0) {
                    result = {
                        code: 414,
                        msg: '修改组长失败，user不是小组成员',
                        data: false
                    };
                } else {
                    await  TeamModel.updateTeamLeader(team_id, leader, username);
                    result = {
                        code: 200,
                        msg: '修改组长成功',
                        data: true
                    };
                }
            } else {
                result = {
                    code: 413,
                    msg: '修改组长失败，leader不是组长',
                    data: false
                };
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '修改失败',
                data: err
            };
        }
        return result;
    }

    // 200 成功，412 异常,413 组长不正确
    static async deleteGroup(team_id, leader) {
        let result = null;
        try {
            let team = await TeamModel.getTeamByTeamId(team_id);
            if (team.leader !== leader) {
                result = {
                    code: 413,
                    msg: '删除失败，组长不正确',
                    data: false
                };
            } else {
                await TeamModel.deleteTeamMember(team_id);
                await TeamModel.deleteTeamLabel(team_id);
                await TeamModel.deleteTeamPit(team_id);
                // 删除任务
                await TeamModel.deleteTeam(team_id);
                result = {
                    code: 200,
                    msg: '删除成功',
                    data: true
                };
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            };
        }
        return result;
    }

}
module.exports = TeamController;