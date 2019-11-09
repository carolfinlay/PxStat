﻿using API;
using PxStat.Template;

namespace PxStat.Workflow
{
    /// <summary>
    /// Returns details of workflow(s) for a specific ReleaseCode
    /// </summary>
    internal class Workflow_BSO_ReadAll : BaseTemplate_Read<Workflow_DTO, Workflow_VLD>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="request"></param>
        internal Workflow_BSO_ReadAll(JSONRPC_API request) : base(request, new Workflow_VLD())
        {
        }

        /// <summary>
        /// Test privilege
        /// </summary>
        /// <returns></returns>
        override protected bool HasPrivilege()
        {
            return IsPowerUser() || IsModerator();
        }

        /// <summary>
        /// Execute
        /// </summary>
        /// <returns></returns>
        protected override bool Execute()
        {
            //Validation of parameters and user have been successful. We may now proceed to read from the database
            var adoWorkflow = new Workflow_ADO();

            //GroupAccounts are returned as an ADO result
            ADO_readerOutput result = adoWorkflow.ReadAll(Ado, DTO, SamAccountName);

            if (!result.hasData)
            {
                return false;
            }

            Response.data = result.data;

            return true;
        }
    }
}