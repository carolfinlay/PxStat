﻿using API;
using Newtonsoft.Json.Linq;
using PxStat.Template;

namespace PxStat.Data
{
    /// <summary>
    /// Read the cube metadata for a pending release
    /// </summary>
    internal class Cube_BSO_ReadPreMetadata : BaseTemplate_Read<Cube_DTO_Read, Cube_VLD_ReadPreDataset>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="request"></param>
        internal Cube_BSO_ReadPreMetadata(JSONRPC_API request) : base(request, new Cube_VLD_ReadPreMetadata())
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
            var item = new Matrix_ADO(Ado).Read(DTO.release, DTO.language, SamAccountName);
            var result = Release_ADO.GetReleaseDTO(item);
            if (result == null)
            {
                Response.data = null;
                return true;
            }

            DTO.language = item.LngIsoCode;
            return Cube_BSO_ReadMetadata.ExecuteReadMetadata(Ado, DTO, result, Response);
        }
    }
}

