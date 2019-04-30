const TeamModel = require('../modules/teamModel');

class TeamController {

    // 200 成功，412 异常, 413 组长不存在，414 部分成员不存在，416 参数不齐全
    static async createGroup(ctx) {
        let req = ctx.request.body;
        if (req.team_name && req.leader && req.members) {
            try {
                let leader = await TeamModel.getUserByUsername(req.leader);
                if (leader === null) {
                    ctx.response.status = 413;
                    ctx.body = {
                        code: 413,
                        msg: '组长不存在',
                        data: null
                    }
                } else {
                    let members = req.members;
                    let flag = true;
                    for (let i = 0; i < members.length; i++) {
                        let user = await TeamModel.getUserByUsername(members[i].username);
                        if (user === null) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        const ret = await TeamModel.createTeam(req);
                        let labels = req.teamlabels;
                        for (let i = 0; i < labels.length; i++) {
                            await TeamModel.createTeamLabel(ret.team_id, labels[i].label);
                        }
                        for (let i = 0; i < members.length; i++) {
                            await TeamModel.createTeamMember(ret.team_id, members[i].username);
                        }
                        const data = await TeamModel.getTeamByTeamId(ret.team_id);
                        ctx.response.status = 200;
                        ctx.body = {
                            code: 200,
                            msg: '创建team成功',
                            data: data
                        }
                    } else {
                        let wrongMembers = req.members;
                        for (let i = 0; i < wrongMembers.length; i++) {
                            let user = await TeamModel.getUserByUsername(members[i].username);
                            if (user !== null) {
                                wrongMembers.splice(i, 1);
                                i--;
                            }
                        }
                        ctx.response.status = 414;
                        ctx.body = {
                            code: 414,
                            msg: '部分成员不存在',
                            data: wrongMembers
                        }
                    }
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

    // 200 成功，412 异常, 413 没有小组
    static async getGroupByGroupId(team_id) {
        let result = null;
        try {
            let data = await TeamModel.getTeamByTeamId(team_id);
            if (data === null) {
                result = {
                    code: 413,
                    msg: '查询成功,没有该小组',
                    data: null
                };
            } else {
                result = {
                    code: 200,
                    msg: '查询成功',
                    data: data
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

    // 200 成功，412 异常, 413 没有小组
    static async getGroupByGroupName(team_name) {
        let result = null;
        try {
            let data = await TeamModel.getTeamByName(team_name);
            if (data.length === 0) {
                result = {
                    code: 413,
                    msg: '查询成功,没有该小组',
                    data: null
                };
            } else {
                result = {
                    code: 200,
                    msg: '查询成功',
                    data: data
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

    // 200 成功，412 异常，413 没有小组
    static async getGroupByTag(tag) {
        let result = null;
        try {
            let data = await TeamModel.getTeamByLabel(tag);
            if (data.length === 0) {
                result = {
                    code: 413,
                    msg: '查询成功,没有小组',
                    data: null
                };
            } else {
                result = {
                    code: 200,
                    msg: '查询成功',
                    data: data
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

    // 200 成功，412 异常，413 没有加入小组
    static async getGroupByUsername(member_username) {
        let result = null;
        try {
            let data = await TeamModel.getTeamByUsername(member_username);
            if (data.length === 0) {
                result = {
                    code: 413,
                    msg: '查询成功,没有加入小组',
                    data: null
                };
            } else {
                result = {
                    code: 200,
                    msg: '查询成功',
                    data: data
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

    // 200 成功，412 异常
    static async getMembersByGroupId(team_id) {
        let result = null;
        try {
            let team = await TeamModel.getTeamByTeamId(team_id);
            if (team === null) {
                result = {
                    code: 412,
                    msg: '查询失败，没有该小组',
                    data: null
                };
            } else {
                let data = await TeamModel.getUserByTeamId(team_id);
                result = {
                    code: 200,
                    msg: '查询成功',
                    data: data
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

    // 200 成功是组长，412 异常， 413 不是组长
    static async isGroupLeader(team_id, leader) {
        let result = null;
        try {
            let team = await TeamModel.getTeamByTeamId(team_id);
            if (team === null) {
                result = {
                    code: 413,
                    msg: '查询失败，没有该小组',
                    data: false
                };
            } else {
                if (team.leader !== leader) {
                    result = {
                        code: 413,
                        msg: '查询成功，不是组长',
                        data: false
                    };
                } else {
                    result = {
                        code: 200,
                        msg: '查询成功，是组长',
                        data: true
                    };
                }
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
            let team = await TeamModel.getTeamByTeamId(team_id);
            if (team === null) {
                result = {
                    code: 413,
                    msg: '查询失败，没有该小组',
                    data: false
                };
            } else {
                let team = await TeamModel.getUserByTeamIdUsername(team_id, member_username);
                if (team.length === 0) {
                    result = {
                        code: 413,
                        msg: '查询成功，不是成员',
                        data: false
                    };
                } else {
                    result = {
                        code: 200,
                        msg: '查询成功，是成员',
                        data: true
                    };
                }
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

    // 200 正常，412 异常，413 需要组长验证，414 不允许添加
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

    // 200 成功，412 异常，413 组长不正确, 414 不能删除组长，415 小组没有该用户
    static async deleteUserFromGrope(team_id, leader, username) {
        let result = null;
        try {
            let isLeader = await TeamModel.getTeamByTeamId(team_id);
            if (isLeader.leader === leader) {
                let team = await TeamModel.getUserByTeamIdUsername(team_id, username);
                if (isLeader.leader === username) {
                    result = {
                        code: 414,
                        msg: '删除失败，不能删除组长',
                        data: false
                    };
                } else if (team.length === 0) {
                    result = {
                        code: 415,
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

    // 200 成功，412 异常，413 成员不正确，414 组长不能退出，415 该小组不存在
    static async deleteUserFromGrope2(team_id, username) {
        let result = null;
        try {
            let teams = await TeamModel.getTeamByTeamId(team_id);
            if (teams === null) {
                result = {
                    code: 415,
                    msg: '查询失败，没有该小组',
                    data: false
                };
            } else {
                if (teams.leader === username) {
                    result = {
                        code: 414,
                        msg: '删除失败,组长不能退出',
                        data: false
                    };
                } else {
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
                }
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

    // 200 成功，412 异常，413 组长不正确，414 成员不正确
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

    // 200 成功，412 异常，413 组长不正确
    static async deleteGroup(team_id, leader) {
        let result = null;
        try {
            let team = await TeamModel.getTeamByTeamId(team_id);
            if (team === null) {
                result = {
                    code: 413,
                    msg: '删除失败，没有该小组',
                    data: false
                };
            } else if (team.leader !== leader) {
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

    // 200 成功，412 异常，413 组长不存在/小组不存在，414 组长不正确，416 参数不齐全
    static async modifyGroup(ctx) {
        let req = ctx.request.body;
        if (req.team_id && req.leader) {
            try {
                let team = await TeamModel.getTeamByTeamId(req.team_id);
                if (team === null) {
                    ctx.response.status = 413;
                    ctx.body = {
                        code: 413,
                        msg: '小组不存在',
                        data: null
                    }
                } else {
                    let leader = await TeamModel.getUserByUsername(req.leader);
                    if (leader === null) {
                        ctx.response.status = 413;
                        ctx.body = {
                            code: 413,
                            msg: '组长不存在',
                            data: null
                        }
                    } else {
                        if (team.leader === req.leader) {
                            await TeamModel.updateTeamDescription(req);
                            await TeamModel.deleteTeamLabel(req.team_id);
                            for (let i = 0; i < req.teamlabels.length; i++) {
                                await TeamModel.createTeamLabel(req.team_id, req.teamlabels[i].label);
                            }
                            let data = await TeamModel.getTeamByTeamId(req.team_id);
                            ctx.response.status = 200;
                            ctx.body = {
                                code: 200,
                                msg: '修改小组信息成功',
                                data: data
                            }
                        } else {
                            ctx.response.status = 414;
                            ctx.body = {
                                code: 414,
                                msg: '组长不正确',
                                data: null
                            }
                        }
                    }
                }
            } catch (err) {
                ctx.response.status = 412;
                ctx.body = {
                    code: 412,
                    msg: '修改小组失败',
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

}
module.exports = TeamController;