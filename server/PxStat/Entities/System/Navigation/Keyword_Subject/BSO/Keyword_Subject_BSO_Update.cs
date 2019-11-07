﻿using API;
using PxStat.Template;

namespace PxStat.System.Navigation
{
    /// <summary>
    /// Updates a Keyword Subject
    /// </summary>
    class Keyword_Subject_BSO_Update : BaseTemplate_Update<Keyword_Subject_DTO, Keyword_Subject_VLD_Update>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="request"></param>
        public Keyword_Subject_BSO_Update(JSONRPC_API request) : base(request, new Keyword_Subject_VLD_Update())
        {
        }

        /// <summary>
        /// Test privilege
        /// </summary>
        /// <returns></returns>
        override protected bool HasPrivilege()
        {
            return IsPowerUser();
        }

        /// <summary>
        /// execute
        /// </summary>
        /// <returns></returns>
        protected override bool Execute()
        {
            var adoKeyword_Subject = new Keyword_Subject_ADO(Ado);

            //Update and retrieve the number of updated rows
            int nUpdated = adoKeyword_Subject.Update(DTO);

            if (nUpdated == 0)
            {
                Log.Instance.Debug("No record found for update request");
                Response.error = Label.Get("error.update");
                return false;
            }
            else if (nUpdated < 0)
            {
                Response.error = Label.Get("error.duplicate");
            }

            Response.data = JSONRPC.success;
            return true;
        }
    }
}

