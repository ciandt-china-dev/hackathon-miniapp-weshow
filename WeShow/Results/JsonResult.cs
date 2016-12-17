using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;

namespace WeShow.Results
{
    public class JsonResult : HttpResponseMessage
    {
        public JsonResult(string result)
        {
            this.Content = new StringContent(result.Replace('\\', '/'), Encoding.GetEncoding("UTF-8"), "application/json");
        }
    }
}