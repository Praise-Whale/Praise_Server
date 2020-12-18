const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { user, praise, praiseTarget } = require('../models/index');
const sequelize = require('sequelize');

module.exports = {
  praiseHome: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseCountResult = await praiseTarget.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.id')), 'praiseCount']],
        include: [{
        model: user,
          attributes: [],
          where: {
            id: userIdx
          }
        }],
      });

      const { praiseCount } = praiseCountResult[0].dataValues;

      const homePraise = await praise.findOne({
        attributes: ['today_praise', 'praise_description'],
        where: {
          id: praiseCount + 1
        }
      });

      const userNickName = await user.findAll({
        attributes: ['nickName'],
        where: {
          id: userIdx
        }
      });

      const { nickName } = userNickName[0];

      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_HOME_SUCCESS, {
        homePraise,
        nickName,
        praiseCount
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}