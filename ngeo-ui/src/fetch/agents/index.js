/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import fetchResource, {
  addResource,
  updateResource
  // deleteResource,
} from '../fetchers';

const getAgents = async () => {
  const { data } = await fetchResource('/agents');
  return data;
};

const getAgentById = async (agentId) => {
  const { data } = await fetchResource(`/agents/${agentId}`);
  return data;
};

const getFieldOfficerAgents = async () => {
  const { data } = await fetchResource('/field_officer/agents');
  return data;
};

const assignAgentToFOO = async ({ resourceId: fooId, data: foo }) => {
  const { data } = await updateResource(`/field_officers/${fooId}`, foo);
  return data;
};

// eslint-disable-next-line camelcase
const activateAgent = async ({ url, is_active }) => {
  const { data } = await updateResource(`${url}`, {
    is_active
  });
  return data;
};

const updateAgentToContract = async (values) => {
  // eslint-disable-next-line no-debugger
  const { data } = await updateResource(
    `/agents/${values.data.agent}/update_terms`,
    {
      denialReason: values.denialReason,
      type: values.resource.name,
      sender: values.sender,
      isDenied: values.isDenied,
      isApproved: values.isApproved
    }
  );
  return data;
};

const deleteAgent = async ({
  url,
  deleteReason,
  approveDelete,
  denialReason,
  sender
}) => {
  const { data } = await updateResource(`${url}/delete`, {
    deleteReason,
    approveDelete,
    denialReason,
    sender
  });
  return data;
};

const addAgent = async (agentData) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    idNumber,
    email,
    terms,
    field_officer
  } = agentData;

  const response = await addResource('/agents', {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    id_number: idNumber,
    email,
    terms
  });
  return response;
};

export function useAgents() {
  return useQuery('agents', getAgents);
}

export function useFieldOfficerAgents() {
  return useQuery('field-officer-agents', getFieldOfficerAgents);
}

export function useAgent(agentId) {
  return useQuery('agent-id', () => getAgentById(agentId));
}

export function useAgentById(agentId) {
  return useQuery('agent-id', () => getAgentById(agentId));
}

export function useAssignAgentToFOO() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const mutation = useMutation(assignAgentToFOO, {
    onSuccess: () => {
      queryClient.invalidateQueries('agent-id'); // Reload agent details
      enqueueSnackbar('Agent assigned successfully!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Error assigning agent', {
        variant: 'error'
      });
    }
  });
  return mutation;
}

export function useUpdateAgentToContract() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const mutation = useMutation(updateAgentToContract, {
    onSuccess: () => {
      queryClient.invalidateQueries('agent-id'); // Reload agent details
      queryClient.invalidateQueries('agents'); // Reload agent details
      enqueueSnackbar('Request sent successfully!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Error sending request', {
        variant: 'error'
      });
    }
  });
  return mutation;
}

export function useDeleteAgent() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteAgent, {
    onSuccess: () => {
      queryClient.invalidateQueries('agent-id'); // Reload agent details
      enqueueSnackbar('Request successful!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Error deactivating agent', {
        variant: 'error'
      });
    }
  });
  return mutation;
}

export function useActivateAgent() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const mutation = useMutation(activateAgent, {
    onSuccess: () => {
      queryClient.invalidateQueries('agent-id');
      enqueueSnackbar('Agent successfully activated!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Error during activation', {
        variant: 'error'
      });
    }
  });
  return mutation;
}

export function useAddAgent() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const mutation = useMutation(addAgent, {
    onSuccess: () => {
      queryClient.invalidateQueries('agents');
      enqueueSnackbar('Success!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Error during operation', {
        variant: 'error'
      });
    }
  });
  return mutation;
}
