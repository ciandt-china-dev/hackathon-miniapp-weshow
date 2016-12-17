﻿using Emgu.CV;
using Emgu.CV.Structure;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Sample
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            CascadeClassifier haar = new CascadeClassifier("haarcascade_eye.xml");    //初始化分类器
            Image<Bgr, Byte> imageGlass= new Image<Bgr, byte>(@"glass.png");
            Image<Bgr, byte> frame = new Image<Bgr, byte>(@"1.jpg");
            Rectangle[] results = haar.DetectMultiScale(frame, 1.3, 3, new System.Drawing.Size(10, 10));
            //检测并将数据储存
            List<Rectangle> Rectangles = new List<Rectangle>(2);
            foreach (Rectangle result in results)
            {

                //CvInvoke.Rectangle(frame, result, new Bgr(Color.Red).MCvScalar, 2);  //在检测到的区域绘制红框
                //  Image<Bgr, Byte> imageGlass = new Image<Bgr, byte>(@"C:\Users\37797\Desktop\glass.png");
                //CvInvoke.BitwiseNot(frame, imageGlass, result)
                Rectangles.Add(result);
            }
            Bitmap imageResult = new Bitmap(frame.Width,frame.Height);
            using (Graphics g = Graphics.FromImage(imageResult))
            {
                RectangleF rect = new RectangleF(Rectangles[0].X, Rectangles[0].Y, Rectangles[1].X - Rectangles[0].X+ Rectangles[1].Width, Rectangles[0].Height);
                g.DrawImage(frame.Bitmap, 0, 0);
                var glass = imageGlass.Bitmap;
                glass.MakeTransparent();
                g.DrawImage(glass, rect);

            }
            Image<Bgr, Byte> res = new Image<Bgr, byte>(imageResult);
            imageBox1.Image = res;
        }
    }
}
