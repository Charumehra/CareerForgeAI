const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      require: [true, "token is required to be added in blacklisting"],
    },
  },
  { timestamps: true },
);

const tokenBlacklistModel = mongoose.model("blacklistToken", blacklistTokenSchema )

module.exports = tokenBlacklistModel