import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import transporter from "../config/mail.js";
import { Result } from "express-validator";

// export async function testMail(req, res, next) {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "StudyBuddy Password Reset",

//       text: `
// Hi ${user.name},

// We received a request to reset your StudyBuddy password.

// Click the link below to reset your password:

// ${resetUrl}

// This link will expire in 15 minutes.

// If you did not request this password reset, you can safely ignore this email.

// Regards,
// StudyBuddy Team
// `,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Password reset email sent succesfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// }

export async function getProfile(req, res, next) {
  const userid = req.user.userId;

  try {
    const user = await User.findById(userid).select(
      "name email dailyGoal createdAt subscription weeklyGoal",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched succesfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

// --------update profile

export async function updateProfile(req, res, next) {
  const userId = req.user.userId;
  const { name, dailyGoal } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name;
    user.dailyGoal = dailyGoal;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Data Updated Succesfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// ----- update weekly goal 

export async function updateWeeklyGoal(req , res, next) {
  
  const userId = req.user.userId;
  const {weeklyGoal} = req.body;


  try{

    if(
      typeof weeklyGoal !== "number"||
      weeklyGoal < 1 ||
      weeklyGoal > 100
    ) {
      return res.status(400).json({
        success:false,
        message:"weekly goal must be between 1 and 100 hours"
      });
    }

    const user = await User.findById(userId);
    
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }

    user.weeklyGoal = weeklyGoal;

    await user.save();

    return res.status(200).json({
      success:true,
      message:"weekly goal fetched succesfully",
      data:{
        weeklyGoal:user.weeklyGoal
      }
    });

  } catch(error){
    console.error(error);
    next(error);
  }

}

// ------ change pas

export async function changePassword(req, res, next) {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current Password is incorrect",
      });
    }

    if (newPassword != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated sucesfully",
    });
  } catch (error) {
    next(error);
  }
}

// ------ forget password ----- //

export async function forgotPassword(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // store token and expiry

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 15);

    await user.save();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
   await transporter.emails.send({
  from: "StudyBuddy <noreply@studybuddypro.site>",
  to: user.email,
  subject: "StudyBuddy Password Reset",
  text: `
Hi ${user.name},

We received a request to reset your StudyBuddy password.

Click the link below to reset your password:

${resetUrl}

This link expires in 15 minutes.

If you did not request this, simply ignore this email.

Regards,
StudyBuddy Team
`,
});

    return res.status(200).json({
        success:true,
        message:"Reset email sent succesufully"
    });

  } catch (error) {
    next(error);
  }
}


export async function resetPassword(req , res, next) {
    const {token , newPassword , confirmPassword} = req.body;

    try{

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            passwordResetToken : hashedToken,
            passwordResetExpires:{$gt : Date.now()}
        });

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or Expired reset token"
            });
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password do not match"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10);
        user.password = hashedPassword;

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        return res.status(200).json({
            success:true,
            message:"Password has been reset succesfully"
        })

    } catch(error){
        next(error);
    }

}