import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import passport from "passport";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới với roleId = 6 (Khách)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: 6, // Tự động gán role Khách
      },
      include: {
        role: true,
      },
    });

    // Loại bỏ password trước khi trả về
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message,
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Lỗi server",
          error: err.message,
        });
      }

      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        data: { user },
      });
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: err.message,
      });
    }
    res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  });
};
