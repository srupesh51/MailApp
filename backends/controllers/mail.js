const composeMail = require('./../models/compose_mail');
const moment = require('moment');
const _ = require('lodash');

exports.createMail = (req,res,next) => {
  const fromUser = req.body.from;
  const toUser = req.body.to;
  const subject = req.body.subject;
  const userId = req.params.id;
  const body = req.body.message_body;
  const newMail = new composeMail();
  newMail.UserID = userId;
  newMail.Messages = [{FromUser: fromUser, ToUser: toUser, Body: body,
  Subject: subject, Date: moment(new Date())}];
  newMail.save().then(async(mailResp) => {
    res.status(200).json({'message': 'Mail Successfully Sent', Mails: {MailID: mailResp.toObject().MailID,
      Messages: mailResp.toObject().Messages}});
  }).catch((error) => {
    res.status(500).json({
      message: error.message
    });
  })
}

exports.reply = (req,res,next) => {
  const mailID = req.params.id;
  const fromUser = req.body.from;
  const toUser = req.body.to;
  const subject = req.body.subject;
  const body = req.body.message_body;
  composeMail.findOneAndUpdate({
      "MailID": req.params.id
  }, {
      "$push": {
        "Messages": {FromUser: fromUser, ToUser: toUser, Body: body,
          Subject: subject, Date: moment(new Date())}
      }
  }, {
      new: true
  }).then((resp) => {
    res.status(200).json({message: 'Mail Successfully Sent', Mails: {MailID: resp.toObject().MailID,
      Messages: resp.toObject().Messages}});
  }).catch((error) => {
      return res.status(500).json({
        message: error.message
      });
  });
}

exports.replyAll = (req,res,next) => {
  const mailID = req.params.id;
  const fromUser = req.body.from;
  const toUser = req.body.to;
  const subject = req.body.subject;
  const body = req.body.message_body;
   composeMail.findOneAndUpdate({
    "MailID": req.params.id
    }, {
        "$push": {
          "Messages": {FromUser: fromUser, ToUser: toUser, Body: body, Subject: subject,
            Date: moment(new Date())}
        }
    }, {
        new: true
    }).then((resp) => {
      res.status(200).json({message: 'Mail Successfully Sent', Mails: resp.toObject().Messages});
    }).catch((error) => {
        return res.status(500).json({
          message: error.message
        });
    });
}

exports.forward = (req,res,next) => {
  const mailID = req.params.id;
  const fromUser = req.body.from;
  const toUser = req.body.to;
  const subject = req.body.subject;
  const body = req.body.message_body;
  composeMail.findOneAndUpdate({
        "MailID": req.params.id
    }, {
        "$push": {
          "Messages": {FromUser: fromUser, ToUser: toUser, Body: body, Subject: subject,
            Date: moment(new Date())}
        }
    }, {
        new: true
    }).then((resp) => {
      res.status(200).json({message: 'Mail Successfully Sent', Mails: {MailID: resp.toObject().MailID,
        Messages: resp.toObject().Messages}});
    }).catch((error) => {
        return res.status(500).json({
          message: error.message
        });
     });
}

exports.getMails = (req,res,next) => {
  composeMail.findOne({MailID: req.params.id}).then((resp) => {
    res.status(200).json({
        message: 'Mails successfully fetched!',
        Mails: resp.toObject().Messages
    });
  }).catch((error) => {
    res.status(500).json({
      message: error.message
    });
  });
}

exports.receivedMail = (req,res,next) => {
  composeMail.find({}).sort({createdOn: -1 }).then((receivedData) => {
      let receivedList = [];
      if(receivedData !== undefined && receivedData.length > 0) {
        receivedData.forEach((received) => {
          const messages = received.toObject().Messages;
          let messageList = [];
          messages.forEach((item) => {
            if(item.ToUser !== undefined && item.ToUser.length > 0) {
              for(let i = 0; i < item.ToUser.length; i++) {
                if(item.ToUser[i] === req.params.received_from) {
                  messageList.push(item);
                }
              }
            }
          });
          if(messageList !== undefined && messageList.length > 0) {
            receivedList.push({MailID: received.MailID, Messages: messageList[messageList.length-1]})
          }
        });
      }
      res.status(200).json({
          message: 'Received Mail successfully fetched!',
          receivedMail: receivedList
      });
  }).catch((error) => {
      res.status(500).json({
        message: error.message
      });
  });

}

exports.sentMail = (req,res,next) => {
    composeMail.find({}).sort({createdOn: -1 }).then((sentData) => {
      let sentList = [];
      if(sentData !== undefined && sentData.length > 0) {
          sentData.forEach((sent) => {
            let messageList = [];
            const messages = sent.toObject().Messages;
            messages.forEach((item) => {
              if(item.FromUser === req.params.sent_from) {
                  messageList.push(item);
              }
            });
            if(messageList !== undefined && messageList.length > 0) {
              sentList.push({MailID: sent.MailID, Messages: messageList[messageList.length-1]})
            }
         });
      }
      res.status(200).json({
          message: 'Sent Mail successfully fetched!',
          sentMail: sentList
      });
  }).catch((error) => {
      res.status(500).json({
        message: error.message
      });
  });
}
